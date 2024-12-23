import React, { useCallback, useEffect, useMemo, useRef } from 'react'
import useEpisodeHook from '@/hooks/mutation/use-episode-hook'
import useComments from '@/hooks/plate/use-comments'
import useEpisodeContent from '@/hooks/query/use-episode-content'
import usePlateStore from '@/store/plate-store'
import { useEditorReadOnly, useEditorState } from '@udecode/plate-common/react'
import { LoaderCircle, Save } from 'lucide-react'

import { Button, buttonVariants } from '@/components/ui/button'
import { clearLasers, cn } from '@/lib/utils'

import { BASE_STATUS } from '@/types/common'

const SaveEpisode = () => {
	const { children } = useEditorState()
	const { allComments } = useComments()
	const savedRef = useRef(JSON.stringify(children))
	const savedCommentsRef = useRef(JSON.stringify(allComments))
	const { saveEpisodeMutation } = useEpisodeHook()
	const { data } = useEpisodeContent()
	const readOnly = useEditorReadOnly()
	const { setCurrentDiffValue } = usePlateStore()

	useEffect(() => {
		setCurrentDiffValue(structuredClone(children))
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [children])

	const handleSave = useCallback(() => {
		const currentChildren = JSON.stringify(children)
		const currentComments = JSON.stringify(allComments)
		if (
			savedRef.current !== currentChildren ||
			savedCommentsRef.current !== currentComments
		) {
			savedRef.current = currentChildren
			savedCommentsRef.current = currentComments
			const clearedLaser = clearLasers(children)
			const text = JSON.stringify(clearedLaser)
			const status = data?.chapter.status || BASE_STATUS
			const chapterId = data?.chapter.parent
			saveEpisodeMutation.mutate({
				status,
				chapterId,
				text,
				comments: allComments,
				prevProps: data?.chapter.props,
			})
		}
	}, [
		children,
		allComments,
		data?.chapter.status,
		data?.chapter.parent,
		data?.chapter.props,
		saveEpisodeMutation,
	])

	useEffect(() => {
		const intervalId = setInterval(handleSave, 10000)
		return () => clearInterval(intervalId)
	}, [handleSave])

	const isSaved = useMemo(() => {
		const currentChildren = JSON.stringify(children)
		const currentComments = JSON.stringify(allComments)
		return (
			savedRef.current === currentChildren &&
			savedCommentsRef.current === currentComments
		)
	}, [children, allComments])

	useEffect(() => {
		const handleBeforeUnload = (event: BeforeUnloadEvent) => {
			if (!isSaved) {
				event.preventDefault()
			}
		}

		window.addEventListener('beforeunload', handleBeforeUnload)

		return () => {
			window.removeEventListener('beforeunload', handleBeforeUnload)
		}
	}, [isSaved])

	if (readOnly) return null

	return (
		<div className="flex gap-2">
			{saveEpisodeMutation.isPending ? (
				<div className={cn(buttonVariants({ variant: 'ghost', size: 'icon' }))}>
					<LoaderCircle className="animate-spin" size={16} />
				</div>
			) : (
				<Button disabled={isSaved} size="icon" onClick={handleSave}>
					<Save size={16} />
				</Button>
			)}
		</div>
	)
}

export default SaveEpisode
