import React, { useEffect, useRef } from 'react'
import useEditorStore, { handleToolStates } from '@/store/editor-store'

import Sidebar from './sidebar'
import Title from './title'
import Toolbar from './toolbar'
import Tooltip from './tooltip'
import Translation from './translation'

const Editor = () => {
	const editorRef = useRef<HTMLDivElement>(null)
	const isTranslationOpen = useEditorStore((state) => state.isTranslationOpen)

	useEffect(() => {
		if (editorRef.current) {
			editorRef.current.focus()
		}
	}, [])

	return (
		<>
			<Title />
			<div className="flex flex-1 gap-2">
				<div className="flex flex-1 flex-col gap-2 rounded-md">
					<Toolbar editorRef={editorRef} />
					<div className="relative flex flex-1 gap-2 rounded-md">
						<Tooltip editorRef={editorRef} />
						<div
							ref={editorRef}
							contentEditable
							className="flex-1 rounded-md bg-background-editor p-4 shadow-editor focus:outline-none focus:ring-2 focus:ring-blue-500"
							suppressContentEditableWarning={true}
							onKeyUp={handleToolStates}
							onMouseUp={handleToolStates}
						>
							German Text....
						</div>
						{isTranslationOpen && <Translation />}
					</div>
				</div>
				<Sidebar />
			</div>
		</>
	)
}

export default Editor
