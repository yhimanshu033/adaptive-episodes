import React, { useCallback, useEffect, useRef } from 'react'
import useEpisodeHook from '@/hooks/mutation/use-episode-hook'
import { useEditorState } from '@udecode/plate-common/react'
import { LoaderCircle, Save } from 'lucide-react'

import { Button, buttonVariants } from '@/components/ui/button'
// import { valueToText } from '@/lib/plate/value-to-text'
import { cn } from '@/lib/utils'

const SaveEpisode = () => {
	const { children } = useEditorState()
	const savedRef = useRef(JSON.stringify(children))
	const { saveEpisodeMutation } = useEpisodeHook()

	const handleSave = useCallback(() => {
		console.log({ children })
		if (savedRef.current === JSON.stringify(children)) return
		savedRef.current = JSON.stringify(children)
		saveEpisodeMutation.mutate(savedRef.current)
	}, [children, saveEpisodeMutation])

	useEffect(() => {
		const intervalId = setInterval(handleSave, 30 * 1000)

		return () => {
			clearInterval(intervalId)
		}
	}, [handleSave])

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
