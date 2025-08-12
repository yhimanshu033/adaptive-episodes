import React from 'react'
import useBaseExtensionMutation from '@/hooks/mutation/use-base-extension-mutation'
import useBaseExtensionQuery from '@/hooks/query/use-base-extension-data'
import useAccessChecks from '@/hooks/use-access-checks'
import { CrossIcon } from '@/icons/cross-icon'
import BaseExtensionForm from '@/page-builders/manage-project/base-extension-form'
import BaseScriptStatus from '@/page-builders/manage-project/base-script-status'
import UpdateDriveFolder from '@/page-builders/manage-project/update-gdrive-folder'
import { useEpisodeStore } from '@/store/episode-store'
import {
	AlertTriangle,
	CheckCircle2,
	FileIcon,
	FileWarningIcon,
	RotateCcw,
} from 'lucide-react'

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
import { formatDate } from '@/lib/format-date'

import { EFolderType } from '@/types/admin-types'

import BaseScriptDocUpload from '../table/base-script-doc-upload'

const BaseScriptExtensionDialog = () => {
	const { useEpisodeTableStore: episodeStore, setBseDialogOpen } =
		useEpisodeStore()
	const isBseDialogOpen = episodeStore((state) => state.isBseDialogOpen)
	const { isGerman } = useAccessChecks()

	return (
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
				<div className="h-full space-y-4 pt-6">
					<IfElse condition={isGerman}>
						<If>
							<UpdateDriveFolder folderType={EFolderType.BASE_SCRIPT} />
							<BaseScriptExtension />
						</If>
						<Else>
							<BaseScriptDocUpload setDialogOpen={setBseDialogOpen} />
						</Else>
					</IfElse>
				</div>
			</DialogContent>
		</Dialog>
	)
}

const BaseScriptExtension = () => {
	const { data, refetch, isFetching, isLoading } = useBaseExtensionQuery(true)

	const baseExtensionMutation = useBaseExtensionMutation()
	const { data: taskId, reset } = baseExtensionMutation

	const extendableRange = React.useMemo(() => {
		if (data && !('message' in data)) {
			return (data?.ranges?.de_end ?? 0) - (data?.ranges?.de_start ?? 1) + 1
		} else {
			return 0
		}
	}, [data])

	const baseTaskId =
		taskId || (data && 'taskId' in data ? data.taskId : undefined)

	if (baseTaskId) {
		return <BaseScriptStatus taskId={baseTaskId} reset={reset} />
	}

	if (isFetching || isLoading) {
		return <CircularLoader />
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
			<If condition={!!data?.previous_extension_status}>
				<div className="text-fm-warning-sec mt-12 w-full">
					<div className="from-fm-surface-warning/20 to-fm-surface-primary/20 flex items-start gap-2 bg-linear-to-r px-4 py-3 text-sm">
						{data?.previous_extension_status.status === 'success' ? (
							<CheckCircle2 className="mt-0.5 size-4" />
						) : (
							<AlertTriangle className="mt-0.5 size-4" />
						)}

						<div className="flex flex-col">
							<p className="font-medium">
								{data?.previous_extension_status.message}
							</p>
							<span className="text-fm-warning-sec text-xs">
								{formatDate(
									data?.previous_extension_status.timestamp || '',
									true
								)}
							</span>
						</div>
					</div>
				</div>
			</If>
		</div>
	)
}

export default BaseScriptExtensionDialog
