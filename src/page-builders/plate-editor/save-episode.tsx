import React, { useCallback, useEffect, useRef } from 'react'
import useEpisodeHook from '@/hooks/mutation/use-episode-hook'
import useComments from '@/hooks/plate/use-comments'
import { setCurrentDiffValue } from '@/store/plate-store'
import { useEditorReadOnly, useEditorState } from '@udecode/plate-common/react'
import { LoaderCircle, Save } from 'lucide-react'

import { Button, buttonVariants } from '@/components/ui/button'
import { clearLasers, cn } from '@/lib/utils'

const SaveEpisode = () => {
	const { children } = useEditorState()
	const { allComments } = useComments()
	const savedRef = useRef(JSON.stringify(children))
	const savedCommentsRef = useRef(JSON.stringify(allComments))
	const { saveEpisodeMutation } = useEpisodeHook()
	const readOnly = useEditorReadOnly()

	useEffect(() => {
		setCurrentDiffValue(structuredClone(children))
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
			saveEpisodeMutation.mutate({ text, comments: allComments })
		}
	}, [children, saveEpisodeMutation, allComments])

	useEffect(() => {
		const intervalId = setInterval(handleSave, 30000)
		return () => clearInterval(intervalId)
	}, [handleSave])

	if (readOnly) return null

	return (
		<div className="flex gap-2">
			{saveEpisodeMutation.isPending ? (
				<div className={cn(buttonVariants({ variant: 'ghost', size: 'icon' }))}>
					<LoaderCircle className="animate-spin" size={16} />
				</div>
			) : (
				<Button size="icon" onClick={handleSave}>
					<Save size={16} />
				</Button>
			)}
		</div>
	)
}

export default SaveEpisode
