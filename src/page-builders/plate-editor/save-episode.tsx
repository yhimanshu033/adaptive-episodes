import React, { useCallback, useEffect, useRef } from 'react'
import useEpisodeHook from '@/hooks/mutation/use-episode-hook'
import {
	useEditorReadOnly,
	useEditorRef,
	useEditorState,
} from '@udecode/plate-common/react'
import { LoaderCircle, Save } from 'lucide-react'

import { Button, buttonVariants } from '@/components/ui/button'
import { clearLasers, cn } from '@/lib/utils'

const SaveEpisode = () => {
	const { children } = useEditorState()
	const editor = useEditorRef()
	const savedRef = useRef(JSON.stringify(children))
	const { saveEpisodeMutation } = useEpisodeHook()
	const readOnly = useEditorReadOnly()

	const handleSave = useCallback(() => {
		const clearedLaser = clearLasers(children)
		editor.tf.setValue(clearedLaser)
		const currentChildren = JSON.stringify(clearedLaser)
		if (savedRef.current !== currentChildren) {
			savedRef.current = currentChildren
			saveEpisodeMutation.mutate({ text: savedRef.current })
		}
	}, [children, saveEpisodeMutation])

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
