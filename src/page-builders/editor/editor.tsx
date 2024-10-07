import React, { useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import useEpisodeContent from '@/hooks/query/use-episode-content'
import useEditorStore, { handleToolStates } from '@/store/editor-store'
import { ArrowLeft, ArrowRight } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'

import Sidebar from './sidebar'
import Title from './title'
import Toolbar from './toolbar'
import Tooltip from './tooltip'
import Translation from './translation'

const Editor = () => {
	const editorRef = useRef<HTMLDivElement>(null)
	const isTranslationOpen = useEditorStore((state) => state.isTranslationOpen)
	const router = useRouter()
	const { id } = useParams()

	const { data: content, isLoading } = useEpisodeContent()

	const handleEpisodeChange = (episode: number) => {
		router.push(
			`${process.env.NEXT_PUBLIC_BASE_URL}/projects/${id as string}/${episode}/editor`
		)
	}

	useEffect(() => {
		if (editorRef.current) {
			editorRef.current.focus()
		}
	}, [])

	return (
		<>
			<div className="mb-5 flex items-center justify-between">
				<Title title={content?.episode_name as string} />
				{!isLoading && (
					<div className="flex gap-2">
						<Button
							variant="outline"
							disabled={!content?.hasPrevious}
							onClick={() => handleEpisodeChange((content?.episode ?? 0) - 1)}
						>
							<ArrowLeft className="mr-2 inline" />
							Previous Episode
						</Button>
						<Button
							disabled={!content?.hasNext}
							onClick={() => handleEpisodeChange((content?.episode ?? 0) + 1)}
						>
							Next Episode <ArrowRight className="ml-2 inline" />
						</Button>
					</div>
				)}
			</div>
			<div className="flex h-[calc(100vh-225px)] gap-2">
				<div className="flex flex-1 flex-col rounded-md">
					<Toolbar editorRef={editorRef} />
					<ScrollArea className="rounded-b-md">
						<div className="relative flex overflow-auto">
							<Tooltip editorRef={editorRef} />
							<div
								ref={editorRef}
								contentEditable
								className="flex-1 bg-background-editor p-4 shadow-editor focus:outline-none"
								suppressContentEditableWarning={true}
								onKeyUp={handleToolStates}
								onMouseUp={handleToolStates}
								dangerouslySetInnerHTML={{
									__html: isLoading
										? 'Loading...'
										: (content?.de.replace(/\r\n/g, '<br />') as string),
								}}
							/>
							{isTranslationOpen && (
								<Translation
									translatedContent={
										isLoading
											? 'Loading...'
											: (content?.us.replace(/\r\n/g, '<br />') as string)
									}
								/>
							)}
						</div>
					</ScrollArea>
				</div>
				<Sidebar />
			</div>
		</>
	)
}

export default Editor
