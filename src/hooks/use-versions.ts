import { useEffect, useMemo, useRef, useState } from 'react'
import { useParams } from 'next/navigation'
import { statuses } from '@/constants/episodes-constants'
import useEpisodeHook from '@/hooks/mutation/use-episode-hook'
import useCustomPlateStore from '@/store/plate-store'
import { useQueryClient } from '@tanstack/react-query'
import { useEditorPlugin } from '@udecode/plate-common/react'

import { useEpisodeContext } from '@/providers/episode-id-provider'
import { FindReplacePlugin } from '@/lib/plate/plugins/find-replace'

import { BASE_STATUS, EStatus } from '@/types/common'
import { ESidebar } from '@/types/plate-types'

export default function useVersions({
	latestStatus,
	selectedStatus,
	isChildEpisode,
	setSelectedStatus,
}: {
	isChildEpisode: boolean
	latestStatus: EStatus | typeof BASE_STATUS
	selectedStatus: EStatus | undefined
	setSelectedStatus: React.Dispatch<React.SetStateAction<EStatus | undefined>>
}) {
	const { id } = useParams()
	const currentSelection = useRef<EStatus>()
	const [isDialogOpen, setIsDialogOpen] = useState(false)

	const queryClient = useQueryClient()

	const { saveEpisodeMutation } = useEpisodeHook()
	const { useOption } = useEditorPlugin(FindReplacePlugin)
	const replaceEnabled = useOption('replaceEnabled')
	const { setViewMode } = useCustomPlateStore()
	const { usePlateStoreContext } = useEpisodeContext()
	const { sidebar } = usePlateStoreContext()

	const latestIndex = useMemo(
		() => (latestStatus !== BASE_STATUS ? statuses.indexOf(latestStatus) : 0),
		[latestStatus]
	)
	const selectedIndex = useMemo(
		() => (selectedStatus ? statuses.indexOf(selectedStatus) : latestIndex),
		[latestIndex, selectedStatus]
	)

	const handleSelect = (value: EStatus) => {
		const currentIndex = statuses.indexOf(value)
		currentSelection.current = value
		if (currentIndex > latestIndex) {
			setIsDialogOpen(true)
		} else {
			setSelectedStatus(value)
		}
	}

	useEffect(() => {
		setViewMode(sidebar === ESidebar.FAR && !!replaceEnabled)
		// eslint-disable-next-line  react-hooks/exhaustive-deps
	}, [replaceEnabled, sidebar])

	const handleConfirm = async () => {
		if (currentSelection.current) {
			await saveEpisodeMutation.mutateAsync({
				text: 'Status update',
				status: currentSelection.current,
			})
			await queryClient.invalidateQueries({ queryKey: ['info'], type: 'all' })
			await queryClient.invalidateQueries({
				queryKey: [Number(id), 'episodes'],
				type: 'all',
			})
		}
	}
	useEffect(() => {
		setViewMode(
			isChildEpisode || selectedIndex < latestIndex + Number(isChildEpisode)
		)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isChildEpisode, latestIndex, latestStatus, selectedIndex, selectedStatus])

	return {
		handleConfirm,
		handleSelect,
		isDialogOpen,
		saveEpisodeMutation,
		latestIndex,
		setIsDialogOpen,
		currentSelection: currentSelection.current,
	}
}
