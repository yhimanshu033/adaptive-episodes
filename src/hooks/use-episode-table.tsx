import { useParams, usePathname, useRouter } from 'next/navigation'
import { EpisodeActions } from '@/constants/episodes-constants'
import { EPISODE_LIST_QUERY_KEY } from '@/constants/query-constants'
import useEpisodeHook from '@/hooks/mutation/use-episode-hook'
import { usePageState } from '@/hooks/use-page-state'
import { useEpisodeStore } from '@/store/episode-store'
import { useQueryClient } from '@tanstack/react-query'
import { Row, Table } from '@tanstack/react-table'
import { useShallow } from 'zustand/react/shallow'

import { BASE_STATUS, EStatus } from '@/types/common'
import { TEpisode, TEpisodeInventForm } from '@/types/episode-type'

const useEpisodeTable = () => {
	const { id } = useParams()
	const router = useRouter()
	const pathname = usePathname()
	const queryClient = useQueryClient()

	const {
		episodeInventMutation,
		episodeDeleteMutation,
		episodesMergeMutation,
		episodeUnmergeMutation,
		statusUpdateMutation,
	} = useEpisodeHook()

	const {
		useEpisodeTableStore,
		setAlertInfo,
		setDeleteEpisodeId,
		setIsDialogOpen,
		setIsInventOpen,
		setSelectedEpisodes,
	} = useEpisodeStore()
	const { deleteEpisodeId, selectedEpisodes, currentInventIndex } =
		useEpisodeTableStore()
	const alertInfo = useEpisodeTableStore(useShallow((state) => state.alertInfo))

	const { currentPage, search, limit } = usePageState()

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
		const selectedRows = table
			.getSelectedRowModel()
			.rows.map((row) => row.original)

		setSelectedEpisodes({
			episodes: selectedRows.length ? selectedRows : [episode],
			status,
		})
		if (selectedRows.length <= 1) {
			setAlertInfo({
				description: `Status of selected episode will switch to ${status}`,
				action: EpisodeActions.UPDATE,
			})
		} else if (hasConsistentStatus(selectedRows)) {
			setAlertInfo({
				description: `Status of ${selectedRows.length} selected episodes will change to ${status}`,
				action: EpisodeActions.UPDATE,
			})
		} else {
			setAlertInfo({
				description: `All selected episodes must have the same current status to update.`,
			})
		}
		setIsDialogOpen(true)
	}

	const handleMerge = (selectedRowData: TEpisode[]) => {
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
				description: `Cannot merge episodes with different statuses`,
			})
		} else if (!isContinuous) {
			setAlertInfo({
				description: 'Selected Episodes are non sequential',
			})
		} else {
			setSelectedEpisodes({
				episodes: selectedRowData,
				status: selectedRowData[0].status,
			})
			setAlertInfo({
				description: 'Selected episodes will get merged',
				action: EpisodeActions.MERGE,
			})
		}
		setIsDialogOpen(true)
	}

	const handleUnmerge = (selectedRowModel: Row<TEpisode>[]) => {
		if (!selectedRowModel[0].getCanExpand()) {
			setAlertInfo({
				description: 'Please select a merged episode',
			})
		} else {
			setSelectedEpisodes({
				episodes: [selectedRowModel[0].original],
				status: selectedRowModel[0].original.status,
			})
			setAlertInfo({
				description: 'Selected Episode will get unmerged',
				action: EpisodeActions.UNMERGE,
			})
		}
		setIsDialogOpen(true)
	}

	const handleAddEpisode = (data: TEpisodeInventForm) => {
		episodeInventMutation.mutate({
			chapter_title: data.title,
			seq_number: (currentInventIndex || 0) + 2 + (currentPage - 1) * limit,
		})
		setIsInventOpen(false)
	}

	const handleDeleteEpisode = (episodeId: number) => {
		setAlertInfo({
			description: 'Selected episode will get permanently deleted',
			action: EpisodeActions.DELETE,
		})
		setDeleteEpisodeId(episodeId)
		setIsDialogOpen(true)
	}

	const handleConfirm = async () => {
		if (!alertInfo) return
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

			await Promise.all(
				episodes.map(async (episode) => {
					if (episode.status === BASE_STATUS) {
						await statusUpdateMutation.mutateAsync({
							parent_id: episode.parent ?? episode.id,
							status: BASE_STATUS,
						})
					}
					return statusUpdateMutation.mutateAsync({
						parent_id: episode.parent ?? episode.id,
						status:
							episode.status === BASE_STATUS
								? EStatus.FIRST_DRAFT
								: episode.status,
					})
				})
			)
			await queryClient.invalidateQueries({
				queryKey: [EPISODE_LIST_QUERY_KEY, Number(id), currentPage, search],
				type: 'all',
			})
		} else if (alertInfo.action === EpisodeActions.DELETE && deleteEpisodeId) {
			episodeDeleteMutation.mutate(deleteEpisodeId)
		}
	}

	return {
		handleStatusChange,
		handleConfirm,
		handleTitleClick,
		handleAddEpisode,
		handleDeleteEpisode,
		handleMerge,
		handleUnmerge,
	}
}

export default useEpisodeTable
