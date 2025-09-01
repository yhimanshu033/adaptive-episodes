import React from 'react'
import { useParams, usePathname, useRouter } from 'next/navigation'
import { EpisodeActions, titleToStatus } from '@/constants/episodes-constants'
import { EPISODE_LIST_QUERY_KEY } from '@/constants/query-constants'
import useEpisodeHook from '@/hooks/mutation/use-episode-hook'
import { usePageState } from '@/hooks/use-page-state'
import { BubbleCheckIcon } from '@/icons/bubble-check-icon'
import { BubbleCrossedIcon } from '@/icons/bubble-crossed-icon'
import { GitBranchIcon } from '@/icons/git-branch-icon'
import { GitForkIcon } from '@/icons/git-fork-icon'
import { TrashIcon } from '@/icons/trash-icon'
import { useEpisodeStore } from '@/store/episode-store'
import { useQueryClient } from '@tanstack/react-query'
import { Row, Table } from '@tanstack/react-table'
import { toast } from 'sonner'
import { useShallow } from 'zustand/react/shallow'

import { Button } from '@/components/aural-ui/button'
import useEpisodeTableContext from '@/providers/episode-table-provider'
import useProjectId from '@/providers/project-id-provider'

import { BASE_STATUS, EStatus } from '@/types/common'
import { TEpisode, TEpisodeInventForm } from '@/types/episode-type'

const useEpisodeTable = () => {
	const { id } = useParams()
	const router = useRouter()
	const pathname = usePathname()
	const queryClient = useQueryClient()
	const { initialStoryData: storyData } = useEpisodeTableContext()

	const { isWriter } = useProjectId()

	const {
		episodeInventMutation,
		episodeDeleteMutation,
		episodesMergeMutation,
		episodeUnmergeMutation,
		statusUpdateMutation,
		episodeMultipleDeleteMutation,
	} = useEpisodeHook()

	const {
		useEpisodeTableStore,
		setAlertInfo,
		setDeleteEpisodeId,
		setIsDialogOpen,
		setIsInventOpen,
		setSelectedEpisodes,
		setStatusUpdating,
	} = useEpisodeStore()
	const {
		deleteEpisodeId,
		selectedEpisodes,
		currentInventSeq,
		statusUpdating,
	} = useEpisodeTableStore()
	const alertInfo = useEpisodeTableStore(useShallow((state) => state.alertInfo))

	const { currentPage, search } = usePageState()

	const handleTitleClick = (episodeId: number) => {
		router.push(`${pathname}/${episodeId}/editor`)
	}

	const hasConsistentStatus = (selectedRows: TEpisode[]) =>
		selectedRows.every((row) => row.status === selectedRows[0].status)

	const handleStatusChange = (
		episode: TEpisode,
		status: EStatus,
		table: Table<TEpisode>
	) => {
		if (!isWriter) {
			return
		}
		const selectedRows = table
			.getSelectedRowModel()
			.rows.map((row) => row.original)

		setSelectedEpisodes({
			episodes: selectedRows.length ? selectedRows : [episode],
			status,
		})
		if (selectedRows.length <= 1) {
			setAlertInfo({
				icon: (
					<GitForkIcon
						className="text-fm-icon-brand-secondary"
						width={44}
						height={44}
					/>
				),
				description: 'Status change',
				subDescription: `Status of selected episode will switch to ${titleToStatus[status]}`,
				action: EpisodeActions.UPDATE,
				secondAction: 'Cancel',
			})
		} else if (hasConsistentStatus(selectedRows)) {
			setAlertInfo({
				icon: (
					<GitForkIcon
						className="text-fm-icon-brand-secondary"
						width={44}
						height={44}
					/>
				),
				description: 'Status update',
				subDescription: `Status of ${selectedRows.length} selected episodes will change to ${status}`,
				action: EpisodeActions.UPDATE,
				secondAction: 'Cancel',
			})
		} else {
			setAlertInfo({
				icon: (
					<GitForkIcon
						className="text-fm-icon-brand-secondary"
						width={44}
						height={44}
					/>
				),
				description: 'Status update',
				subDescription: `All selected episodes must have the same current status to update.`,
				secondAction: 'Got it',
			})
		}
		setIsDialogOpen(true)
	}

	const handleMerge = (selectedRowData: TEpisode[]) => {
		if (!isWriter) {
			return
		}
		const { isStatusSame, isContinuous } = selectedRowData.reduce(
			(acc, row, index) => ({
				isStatusSame:
					acc.isStatusSame &&
					(index === 0 || row.status === selectedRowData[0].status),
				isContinuous:
					acc.isContinuous &&
					(index === 0 ||
						row.seq_number - selectedRowData[index - 1].seq_number === 1),
			}),
			{
				isStatusSame: true,
				isContinuous: true,
			}
		)

		if (!isStatusSame) {
			setAlertInfo({
				icon: (
					<GitForkIcon
						className="text-fm-icon-brand-secondary"
						width={44}
						height={44}
					/>
				),
				description: 'Couldn’t combine episodes',
				subDescription: 'You can only combine episodes with the same status',
				secondAction: 'Got it',
			})
		} else if (!isContinuous) {
			setAlertInfo({
				icon: (
					<GitForkIcon
						className="text-fm-icon-brand-secondary"
						width={44}
						height={44}
					/>
				),
				description: 'Episode sequential fail',
				subDescription: 'Selected Episodes are non sequential',
				secondAction: 'Got it',
			})
		} else {
			setSelectedEpisodes({
				episodes: selectedRowData,
				status: selectedRowData[0].status,
			})
			setAlertInfo({
				icon: (
					<GitForkIcon
						className="text-fm-icon-brand-secondary"
						width={44}
						height={44}
					/>
				),
				description: `Combine <${selectedRowData.length}> episodes`,
				subDescription: 'You can merge selected episodes into one',
				action: EpisodeActions.MERGE,
				secondAction: 'Cancel',
			})
		}
		setIsDialogOpen(true)
	}

	const handleUnmerge = (selectedRowModel: Row<TEpisode>[]) => {
		if (!isWriter) {
			return
		}
		if (!selectedRowModel[0].getCanExpand()) {
			setAlertInfo({
				icon: (
					<GitBranchIcon
						className="text-fm-icon-brand-secondary"
						width={44}
						height={44}
					/>
				),
				description: 'Separate episode fail',
				subDescription: 'Please select a merged episode',
				secondAction: 'Got it',
			})
		} else {
			setSelectedEpisodes({
				episodes: [selectedRowModel[0].original],
				status: selectedRowModel[0].original.status,
			})
			setAlertInfo({
				icon: (
					<GitBranchIcon
						className="text-fm-icon-brand-secondary"
						width={44}
						height={44}
					/>
				),
				description: 'Unmerge Success',
				subDescription: 'Selected Episode will get unmerged',
				action: EpisodeActions.UNMERGE,
				secondAction: 'Cancel',
			})
		}
		setIsDialogOpen(true)
	}

	const handleAddEpisode = (data: TEpisodeInventForm) => {
		if (!isWriter) {
			return
		}
		// TODO add episode on last
		episodeInventMutation.mutate(
			{
				chapter_title: data.title,
				seq_number: Math.max(currentInventSeq || 0, 1),
				language: storyData?.parent_language,
			},
			{
				onSuccess: (data) => {
					if (!data?.project_id || !data?.id) {
						toast.error('Episode could not be created!')
						return
					}
					toast.custom(
						(id) => (
							<div className="text-fm-contrast item-center flex w-full justify-between">
								<div className="flex items-center gap-2">
									<BubbleCheckIcon className="size-6" />
									<div>New episode created successfully</div>
								</div>
								<Button
									variant="outline"
									innerClassName="!h-8 text-fm-contrast !text-fm-sm border-fm-divider-tertiary"
									onClick={() => {
										toast.dismiss(id)
										router.push(
											`/projects/${data?.project_id}/${data?.id}/content`
										)
									}}
								>
									View
								</Button>
							</div>
						),
						{
							duration: 3000,
							className: 'w-md max-w-none',
						}
					)
				},

				onError: () => {
					toast.error('Failed to add episode', {
						icon: <BubbleCrossedIcon />,
					})
				},
			}
		)
		setIsInventOpen(false)
	}

	const handleDeleteEpisode = (episodeId: number, episodeSeq: number) => {
		if (!isWriter) {
			return
		}
		setAlertInfo({
			action: EpisodeActions.DELETE,
			variant: 'negative',
			icon: (
				<TrashIcon className="text-fm-icon-negative" width={44} height={44} />
			),
			description: `Delete Episode ${episodeSeq} permanently`,
			subDescription: 'Once deleted, this can’t be undone',
			secondAction: 'Cancel',
		})
		setDeleteEpisodeId(episodeId)
		setIsDialogOpen(true)
	}

	const handleMultiDeleteEpisode = (selectedRowData: TEpisode[]) => {
		if (!isWriter) {
			return
		}
		const unInventedSeq = selectedRowData
			.filter((row) => !row.props?.creation_timestamp)
			.map((row) => row.seq_number)

		if (unInventedSeq?.length) {
			setAlertInfo({
				variant: 'negative',
				icon: (
					<TrashIcon className="text-fm-icon-negative" width={44} height={44} />
				),
				description: `Only invented episodes can be deleted`,
				subDescription: `Episodes ${unInventedSeq.join(', ')} cannot be deleted`,
				secondAction: 'Got it',
			})
			setIsDialogOpen(true)
			return
		}
		setAlertInfo({
			variant: 'negative',
			icon: (
				<TrashIcon className="text-fm-icon-negative" width={44} height={44} />
			),
			description: `Delete ${selectedRowData.length} episodes permanently`,
			subDescription: "Once deleted, this can't be undone",
			action: EpisodeActions.MULTI_DELETE,
			secondAction: 'Cancel',
		})
		setSelectedEpisodes({
			episodes: selectedRowData,
			status: selectedRowData[0].status,
		})
		setIsDialogOpen(true)
	}

	const handleEpisodeInfo = ({
		icon,
		title,
		description,
	}: {
		description: string
		icon: React.ReactNode
		title: string
	}) => {
		setAlertInfo({
			action: EpisodeActions.INFO,
			variant: 'info',
			icon: icon,
			description: title,
			subDescription: description,
		})
		setIsDialogOpen(true)
	}

	const handleConfirm = async () => {
		if (!alertInfo || alertInfo.action === EpisodeActions.INFO || !isWriter) {
			return
		}
		if (alertInfo.action === EpisodeActions.MERGE && selectedEpisodes) {
			episodesMergeMutation.mutate(
				selectedEpisodes.episodes.map((episode) => episode.id) || []
			)
		} else if (
			alertInfo.action === EpisodeActions.UNMERGE &&
			selectedEpisodes
		) {
			episodeUnmergeMutation.mutate(selectedEpisodes.episodes[0].id)
		} else if (alertInfo.action === EpisodeActions.UPDATE && selectedEpisodes) {
			const { episodes } = selectedEpisodes

			const episodeIds = episodes.map((episode) => episode.id)

			setStatusUpdating([...statusUpdating, ...episodeIds])

			await Promise.all(
				episodes.map(async (episode) => {
					if (episode.status === BASE_STATUS) {
						await statusUpdateMutation.mutateAsync({
							parent_id: episode.parent ?? episode.id,
							status: BASE_STATUS,
							language: episode.language,
						})
					}
					return statusUpdateMutation.mutateAsync({
						parent_id: episode.parent ?? episode.id,
						status:
							episode.status === BASE_STATUS
								? EStatus.FIRST_DRAFT
								: episode.status,
						language: episode.language,
					})
				})
			)

			await queryClient.invalidateQueries({
				queryKey: [EPISODE_LIST_QUERY_KEY, Number(id), currentPage, search],
				type: 'all',
			})

			setStatusUpdating(statusUpdating.filter((id) => !episodeIds.includes(id)))
		} else if (alertInfo.action === EpisodeActions.DELETE && deleteEpisodeId) {
			episodeDeleteMutation.mutate(deleteEpisodeId)
		} else if (
			alertInfo.action === EpisodeActions.MULTI_DELETE &&
			selectedEpisodes
		) {
			const seqNumber = selectedEpisodes.episodes.map(
				(episode) => episode.seq_number
			)
			episodeMultipleDeleteMutation.mutate(seqNumber)
		}
	}
	return {
		handleStatusChange,
		handleConfirm,
		handleTitleClick,
		handleAddEpisode,
		handleDeleteEpisode,
		handleMultiDeleteEpisode,
		handleMerge,
		handleUnmerge,
		handleEpisodeInfo,
		statusUpdating,
	}
}

export default useEpisodeTable
