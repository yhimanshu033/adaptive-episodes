import { useParams, usePathname, useRouter } from 'next/navigation'
import { episodeLimit } from '@/constants/episodes-constants'
import useEpisodeHook from '@/hooks/mutation/use-episode-hook'
import {
	setAlertInfo,
	setDeleteEpisodeId,
	setIsDialogOpen,
	setIsInventOpen,
	setSelectedEpisodes,
	useEpisodeStore,
} from '@/store/episode-store'
import { useQueryClient } from '@tanstack/react-query'
import { Row, Table } from '@tanstack/react-table'
import { useShallow } from 'zustand/react/shallow'

import { EStatus } from '@/types/common'
import { TEpisode, TEpisodeInventForm } from '@/types/episode-type'

import { usePageState } from './use-page-state'

const useEpisodeTable = () => {
	const { id } = useParams()
	const router = useRouter()
	const pathname = usePathname()
	const queryClient = useQueryClient()

	const {
		saveEpisodeMutation,
		episodeInventMutation,
		episodeDeleteMutation,
		episodesMergeMutation,
		episodeUnmergeMutation,
	} = useEpisodeHook()

	const {
		episodeSearch,
		deleteEpisodeId,
		selectedEpisodes,
		currentInventIndex,
	} = useEpisodeStore()
	const alertInfo = useEpisodeStore(useShallow((state) => state.alertInfo))

	const { currentPage } = usePageState()

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
				action: 'update',
			})
		} else if (hasConsistentStatus(selectedRows)) {
			setAlertInfo({
				description: `Status of ${selectedRows.length} selected episodes will change to ${status}`,
				action: 'update',
			})
		} else {
			setAlertInfo({
				description: `All selected episodes must have the same current status to update.`,
			})
		}
		setIsDialogOpen(true)
	}

	const handleMerge = (selectedRowData: TEpisode[]) => {
		const isStatusSame = selectedRowData.every(
			(row) => row.status === selectedRowData[0].status
		)

		const isContinuous = selectedRowData.every(
			(row, index) =>
				index === 0 ||
				row.seq_number - selectedRowData[index - 1].seq_number === 1
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
				action: 'merge',
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
				action: 'unmerge',
			})
		}
		setIsDialogOpen(true)
	}

	const handleAddEpisode = (data: TEpisodeInventForm) => {
		episodeInventMutation.mutate({
			chapter_title: data.title,
			seq_number:
				(currentInventIndex || 0) + 2 + (currentPage - 1) * episodeLimit,
		})
		setIsInventOpen(false)
	}

	const handleDeleteEpisode = (episodeId: number) => {
		setAlertInfo({
			description: 'Selected episode will get permanently deleted',
			action: 'delete',
		})
		setDeleteEpisodeId(episodeId)
		setIsDialogOpen(true)
	}

	const handleConfirm = async () => {
		if (!alertInfo) return
		if (alertInfo.action === 'merge' && selectedEpisodes) {
			episodesMergeMutation.mutate(
				selectedEpisodes.episodes.map((episode) => episode.id) || []
			)
		} else if (alertInfo.action === 'unmerge' && selectedEpisodes) {
			episodeUnmergeMutation.mutate(selectedEpisodes.episodes[0].id)
		} else if (alertInfo.action === 'update' && selectedEpisodes) {
			const { episodes, status } = selectedEpisodes

			await Promise.all(
				episodes.map((episode) => {
					return saveEpisodeMutation.mutateAsync({
						text: 'Status update',
						status,
						chapterId: episode.parent ?? episode.id,
					})
				})
			)
			await queryClient.invalidateQueries({
				queryKey: [Number(id), 'episodes', currentPage, episodeSearch],
				type: 'all',
			})
		} else if (alertInfo.action === 'delete' && deleteEpisodeId) {
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
