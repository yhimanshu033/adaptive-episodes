import React, { useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import useEpisodeContent from '@/hooks/query/use-episode-content'
import useEditorStore, { handleToolStates } from '@/store/editor-store'
import { ArrowLeft, ArrowRight } from 'lucide-react'

import { Button } from '@/components/ui/button'

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
			<Title title={content?.episode_name as string} />
			<div className="flex flex-1 gap-2">
				<div className="flex flex-1 flex-col rounded-md">
					<Toolbar editorRef={editorRef} />
					<div className="relative flex flex-1 overflow-auto rounded-b-md">
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
					{!isLoading && (
						<div className="mt-5 flex justify-between">
							<Button
								variant="outline"
								disabled={!content?.hasPrevious}
								onClick={() => handleEpisodeChange((content?.episode ?? 0) - 1)}
							>
								<ArrowLeft className="inline" />
								Previous Episode
							</Button>
							<Button
								disabled={!content?.hasNext}
								onClick={() => handleEpisodeChange((content?.episode ?? 0) + 1)}
							>
								Next Episode <ArrowRight className="inline" />
							</Button>
						</div>
					)}
				</div>
				<Sidebar />
			</div>
		</>
	)
}

export default Editor
