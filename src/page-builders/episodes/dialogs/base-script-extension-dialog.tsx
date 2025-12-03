import React, { useEffect, useMemo } from 'react'
import { useParams } from 'next/navigation'
import { EPISODE_LIST_QUERY_KEY } from '@/constants/query-constants'
import useBaseExtensionMutation from '@/hooks/mutation/use-base-extension-mutation'
import useBaseExtensionQuery from '@/hooks/query/use-base-extension-data'
import useAccessChecks from '@/hooks/use-access-checks'
import useSocketStreaming from '@/hooks/use-socket-streaming'
import { CrossIcon } from '@/icons/cross-icon'
import AdaptationContainer from '@/page-builders/episodes/table/adaptation-container'
import BaseExtensionForm from '@/page-builders/manage-project/base-extension-form'
import BaseScriptStatus, {
	BaseScriptStatusBanner,
} from '@/page-builders/manage-project/base-script-status'
import UpdateDriveFolder from '@/page-builders/manage-project/update-gdrive-folder'
import { useEpisodeStore } from '@/store/episode-store'
import { useQueryClient } from '@tanstack/react-query'
import { FileIcon, FileWarningIcon, RotateCcw } from 'lucide-react'
import { toast } from 'sonner'

import Badge from '@/components/aural-ui/badge'
import CircularLoader from '@/components/aural-ui/circular-loader'
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/aural-ui/dialog'
import { Divider } from '@/components/aural-ui/divider'
import {
	IconButton,
	iconButtonVariants,
} from '@/components/aural-ui/icon-button'
import { Else, If, IfElse } from '@/components/aural-ui/if-else'
import { Typography } from '@/components/aural-ui/typography'
import useAdaptation from '@/providers/adaptation-provider'
import { isBSENotRunning, isBSERunning, parseIfJson } from '@/lib/utils/helpers'

import { EBSETaskType, EFolderType, TBSEStatusBase } from '@/types/admin-types'

import BaseScriptDocUpload from '../table/base-script-doc-upload'

const BaseScriptExtensionDialog = () => {
	const { id } = useParams()
	const queryClient = useQueryClient()
	const { responses } = useSocketStreaming()
	const { useEpisodeTableStore: episodeStore, setBseDialogOpen } =
		useEpisodeStore()
	const isBseDialogOpen = episodeStore((state) => state.isBseDialogOpen)
	const { isGerman } = useAccessChecks()

	const { data: baseExtensionData } = useBaseExtensionQuery(true)

	const { bseRunningTaskId, isGeneratingLS } = useMemo(() => {
		if (baseExtensionData && isBSERunning(baseExtensionData)) {
			return {
				bseRunningTaskId: baseExtensionData.task_id,
				isGeneratingLS:
					baseExtensionData.extension_status?.task_type === EBSETaskType.LS_GEN,
			}
		}
		return { bseRunningTaskId: undefined, isGeneratingLS: false }
	}, [baseExtensionData])

	useEffect(() => {
		const handleBaseExtensionResponse = async () => {
			if (!bseRunningTaskId || isGeneratingLS) {
				return
			}
			const parsedMessage =
				responses[bseRunningTaskId] && responses[bseRunningTaskId].length > 0
					? parseIfJson(responses[bseRunningTaskId].at(-1))
					: null
			if (!parsedMessage) {
				return
			}
			const message =
				typeof parsedMessage === 'object'
					? (parsedMessage as { message: string }).message
					: parsedMessage
			if (message) {
				await queryClient.invalidateQueries({
					queryKey: [EPISODE_LIST_QUERY_KEY, Number(id)],
					type: 'all',
				})
				toast.success(message)
			}
		}

		void handleBaseExtensionResponse()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [bseRunningTaskId, responses, isGeneratingLS])

	return (
		<>
			<If condition={isGeneratingLS}>
				<AdaptationContainer disableUI lsTaskId={bseRunningTaskId} />
			</If>
			<Dialog open={isBseDialogOpen} onOpenChange={setBseDialogOpen}>
				<DialogContent
					noise="none"
					showCloseButton={false}
					opacity="high"
					glass="high"
					borderConfig={['left', 'right']}
					className="max-sm:[100vw] h-[85vh] w-[90vw] gap-5 px-8 [box-shadow:none]"
				>
					<DialogHeader>
						<DialogTitle className="mb-0 flex items-center justify-between gap-4 py-2">
							Import more episodes
							<DialogClose
								className={iconButtonVariants({
									variant: 'ghost',
									size: 'small',
									shape: 'square',
								})}
							>
								<CrossIcon className="h-4 w-4" />
							</DialogClose>
						</DialogTitle>

						<DialogDescription className="sr-only">
							Import more episodes
						</DialogDescription>
						<Divider variant="dashed" />
					</DialogHeader>
					<div className="flex h-full flex-col space-y-4 overflow-y-auto pt-6">
						<If condition={isGerman}>
							<UpdateDriveFolder folderType={EFolderType.BASE_SCRIPT} />
						</If>
						<BaseScriptExtension
							setDialogOpen={setBseDialogOpen}
							isGerman={isGerman}
						/>
					</div>
				</DialogContent>
			</Dialog>
		</>
	)
}

const BaseScriptExtension = ({
	setDialogOpen,
	isGerman,
}: {
	isGerman: boolean
	setDialogOpen: (open: boolean) => void
}) => {
	const { data, refetch, isFetching, isLoading } = useBaseExtensionQuery(true)

	const baseExtensionMutation = useBaseExtensionMutation()
	const { data: taskId, reset } = baseExtensionMutation

	const { storyData } = useAdaptation()

	const extendableRange = React.useMemo(() => {
		if (data && !('message' in data)) {
			return (data?.ranges?.de_end ?? 0) - (data?.ranges?.de_start ?? 1) + 1
		} else {
			return 0
		}
	}, [data])

	const baseTaskId = data && 'task_id' in data ? data.task_id : taskId

	const statusData = React.useMemo(() => {
		const build = (status: TBSEStatusBase, task_id: string | null) => ({
			message: status.message,
			status: status.status,
			timestamp: status.timestamp,
			task_id,
		})

		if (isBSERunning(data)) {
			const { extension_status: status, task_id } = data
			return build(status, task_id)
		}

		if (isBSENotRunning(data)) {
			const { previous_extension_status: status } = data
			const task_id = 'previous_task_id' in data ? data.previous_task_id : null
			return build(status, task_id)
		}

		return null
	}, [data])

	const renderContent = () => {
		if (baseTaskId || storyData?.id) {
			return (
				<BaseScriptStatus
					taskId={baseTaskId}
					reset={reset}
					storyId={storyData?.id}
				/>
			)
		}

		if (isFetching || isLoading) {
			return <CircularLoader />
		}

		if (!isGerman) {
			return <BaseScriptDocUpload setDialogOpen={setDialogOpen} />
		}

		if (!data || (data && 'message' in data)) {
			return null
		}

		return (
			<div className="space-y-8">
				<div className="relative z-0 flex flex-col gap-5 px-3 py-4">
					<div className="absolute inset-0 z-[-1] bg-[url('/assets/dusky_bg.webp')] bg-cover bg-center opacity-16" />
					<div className="flex items-center gap-2">
						<IfElse condition={!!data?.file_found}>
							<If>
								<Badge className="flex gap-2" size="sm">
									<FileIcon size={16} />
									<span className="truncate font-semibold">
										{data?.file_name}
									</span>
								</Badge>
							</If>
							<Else>
								<span className="flex items-center gap-2 font-semibold text-red-600">
									<FileWarningIcon size={16} /> File Not Found
								</span>
							</Else>
						</IfElse>
					</div>
					<IfElse condition={!!data?.file_found}>
						<If>
							<div className="flex flex-col gap-2">
								<div className="flex items-center gap-2">
									<Typography as="h4" variant="body-medium">
										Extendable Episode Range:
									</Typography>
									<Badge className="p-2">{data?.ranges?.de_start || 0}</Badge>
									{' - '}
									<Badge className="p-2">{data?.ranges?.de_end || 0}</Badge>
								</div>
								<Typography
									as="h4"
									variant="caption-medium"
									className="bg-fm-info-tert text-fm-info-sec mt-4 p-2"
								>
									Total episodes available to extend:{' '}
									<strong>{extendableRange}</strong>
								</Typography>
							</div>
						</If>
						<Else>
							<Typography
								as="h4"
								variant="caption-medium"
								className="bg-fm-info-tert text-fm-info-sec rounded p-1"
							>
								The file for base script extension couldn&apos;t be located.
							</Typography>
						</Else>
					</IfElse>
					<div className="absolute right-1 bottom-1">
						<IconButton
							variant="ghost"
							size="small"
							onClick={() => void refetch()}
							icon={<RotateCcw className="h-4 w-4" />}
							label="Refresh"
						/>
					</div>
				</div>
				<If condition={!!data?.file_found}>
					<BaseExtensionForm
						totalEpisodes={extendableRange}
						data={data ?? undefined}
						baseExtensionMutation={baseExtensionMutation}
					/>
				</If>
			</div>
		)
	}

	return (
		<div className="flex h-full flex-col justify-between gap-5">
			{renderContent()}
			<BaseScriptStatusBanner statusData={statusData} />
		</div>
	)
}

export default BaseScriptExtensionDialog
