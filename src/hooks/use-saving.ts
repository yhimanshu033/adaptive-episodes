import { useCallback, useEffect, useMemo, useRef } from 'react'
import useEpisodeHook from '@/hooks/mutation/use-episode-hook'
import useComments from '@/hooks/plate/use-comments'
import useEpisodeContent from '@/hooks/query/use-episode-content'
import { useQueryClient } from '@tanstack/react-query'
import { useEditorState } from '@udecode/plate-common/react'

import { clearLasers } from '@/lib/utils/plate'

import { BASE_STATUS } from '@/types/common'
import { TNote } from '@/types/plate-types'

import { useToast } from './use-toast'

export default function useSaving() {
	const queryClient = useQueryClient()
	const { children } = useEditorState()
	const { allComments } = useComments()
	const savedRef = useRef(JSON.stringify(children))
	const savedCommentsRef = useRef(JSON.stringify(allComments))
	const { saveEpisodeMutation } = useEpisodeHook()
	const { data, queryKey } = useEpisodeContent()

	const { toast } = useToast()

	const handleSave = useCallback(
		({ note, deleteNoteId }: { deleteNoteId?: string; note?: TNote } = {}) => {
			const currentChildren = JSON.stringify(children)
			const currentComments = JSON.stringify(allComments)
			if (
				savedRef.current !== currentChildren ||
				savedCommentsRef.current !== currentComments ||
				note ||
				deleteNoteId
			) {
				savedRef.current = currentChildren
				savedCommentsRef.current = currentComments
				const clearedLaser = clearLasers(children)
				const text = JSON.stringify(clearedLaser)
				const status = data?.chapter.status || BASE_STATUS
				const chapterId = data?.chapter.parent
				let notes = data?.chapter.props?.notes || []
				if (note) {
					notes = [...notes, note]
				}
				if (deleteNoteId) {
					notes = notes.filter((n) => n.id !== deleteNoteId)
				}

				saveEpisodeMutation.mutate(
					{
						status,
						chapterId,
						text,
						comments: allComments,
						prevProps: data?.chapter.props,
						notes,
					},
					{
						// eslint-disable-next-line @typescript-eslint/no-misused-promises
						onSuccess: async () => {
							const invalidateQueries = note || deleteNoteId
							const toastMessage = note
								? 'Added to Notes'
								: deleteNoteId
									? 'Note Deleted'
									: ''

							if (invalidateQueries) {
								await queryClient.invalidateQueries({ queryKey })
							}
							if (toastMessage) {
								toast({
									title: toastMessage,
								})
							}
						},
					}
				)
			}
		},
		[
			children,
			allComments,
			data?.chapter.status,
			data?.chapter.parent,
			data?.chapter.props,
			saveEpisodeMutation,
			queryClient,
			queryKey,
			toast,
		]
	)

	const handleSaveAsync = useCallback(
		async ({
			note,
			deleteNoteId,
		}: { deleteNoteId?: string; note?: TNote } = {}) => {
			const currentChildren = JSON.stringify(children)
			const currentComments = JSON.stringify(allComments)
			if (
				savedRef.current !== currentChildren ||
				savedCommentsRef.current !== currentComments ||
				note ||
				deleteNoteId
			) {
				savedRef.current = currentChildren
				savedCommentsRef.current = currentComments
				const clearedLaser = clearLasers(children)
				const text = JSON.stringify(clearedLaser)
				const status = data?.chapter.status || BASE_STATUS
				const chapterId = data?.chapter.parent
				let notes = data?.chapter.props?.notes || []
				if (note) {
					notes = [...notes, note]
				}
				if (deleteNoteId) {
					notes = notes.filter((n) => n.id !== deleteNoteId)
				}

				await saveEpisodeMutation.mutateAsync(
					{
						status,
						chapterId,
						text,
						comments: allComments,
						prevProps: data?.chapter.props,
						notes,
					},
					{
						// eslint-disable-next-line @typescript-eslint/no-misused-promises
						onSuccess: async () => {
							const invalidateQueries = note || deleteNoteId
							const toastMessage = note
								? 'Added to Notes'
								: deleteNoteId
									? 'Note Deleted'
									: ''

							if (invalidateQueries) {
								await queryClient.invalidateQueries({ queryKey })
							}
							if (toastMessage) {
								toast({
									title: toastMessage,
								})
							}
						},
					}
				)
			}
		},
		[
			children,
			allComments,
			data?.chapter.status,
			data?.chapter.parent,
			data?.chapter.props,
			saveEpisodeMutation,
			queryClient,
			queryKey,
			toast,
		]
	)

	const isSaved = useMemo(() => {
		const currentChildren = JSON.stringify(children)
		const currentComments = JSON.stringify(allComments)
		return (
			savedRef.current === currentChildren &&
			savedCommentsRef.current === currentComments
		)
	}, [children, allComments])

	useEffect(() => {
		if (savedCommentsRef.current !== JSON.stringify(allComments)) {
			handleSave()
		}
	}, [allComments, handleSave])

	return {
		handleSave,
		isSaved,
		handleSaveAsync,
		isPending: saveEpisodeMutation.isPending,
	}
}
