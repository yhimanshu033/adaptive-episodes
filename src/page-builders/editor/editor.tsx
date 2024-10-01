import React, { useEffect, useRef } from 'react'
import useEpisodeContent from '@/hooks/query/use-episode-content'
import useEditorStore, { handleToolStates } from '@/store/editor-store'

import Sidebar from './sidebar'
import Title from './title'
import Toolbar from './toolbar'
import Tooltip from './tooltip'
import Translation from './translation'

const Editor = () => {
	const editorRef = useRef<HTMLDivElement>(null)
	const isTranslationOpen = useEditorStore((state) => state.isTranslationOpen)

	const { data: content, isLoading } = useEpisodeContent()

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
							className="flex-1 border-r bg-background-editor p-4 shadow-editor focus:outline-none"
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
				</div>
				<Sidebar />
			</div>
		</>
	)
}

export default Editor
