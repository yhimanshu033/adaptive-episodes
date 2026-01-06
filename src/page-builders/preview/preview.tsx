import React, { useMemo } from 'react'
import { useRouter } from 'next/navigation'
import useEpisodeContent from '@/hooks/query/use-episode-content'
import useMyEditor from '@/hooks/use-my-editor'
import { CrossIcon } from '@/icons/cross-icon'
import { Plate } from 'platejs/react'

import { IconButton } from '@/components/aural-ui/icon-button'
import { ScrollArea } from '@/components/aural-ui/scroll-area'
import { Editor, EditorContainer } from '@/components/plate-ui-v2/editor'

const PreviewContent = () => {
	const router = useRouter()
	const { data, isLoading, isEnabled } = useEpisodeContent()

	const handleClick = () => {
		router.back()
	}

	const content = useMemo(() => {
		if (isLoading || !isEnabled) {
			return 'Loading...'
		}
		return data?.text || 'No content available!'
	}, [data, isLoading, isEnabled])

	const editor = useMyEditor({
		content,
		id: 'preview-editor',
		simplified: true,
	})

	return (
		<div className="bg-fm-surface-primary h-dvh overflow-hidden px-10">
			<IconButton
				icon={<CrossIcon />}
				label="Close Preview"
				className="absolute top-4 right-4 z-10"
				onClick={handleClick}
				variant="ghost"
			/>
			<div className="border-fm-divider-tertiary mx-auto max-w-160 border-x">
				<ScrollArea className="h-dvh">
					<div className="border-fm-divider-tertiary flex flex-col-reverse gap-2 border-b px-14 py-12">
						<h1 className="text-fm-primary font-fm-text [font-size:var(--text-fm-2xl)]">
							{data?.chapter?.chapter_title || 'Episode Title'}
						</h1>
						{data?.chapter?.seq_number && (
							<p className="text-fm-tertiary font-fm-brand leading-fm-xl [font-size:var(--text-fm-xl)] uppercase">
								{`Ep${data?.chapter?.seq_number < 9 ? `0${data?.chapter.seq_number}` : data?.chapter.seq_number}`}
							</p>
						)}
					</div>
					<div className="px-14 py-12">
						<Plate editor={editor} readOnly>
							<EditorContainer>
								<Editor variant="demo" />
							</EditorContainer>
						</Plate>
					</div>
				</ScrollArea>
			</div>
		</div>
	)
}

export default PreviewContent
