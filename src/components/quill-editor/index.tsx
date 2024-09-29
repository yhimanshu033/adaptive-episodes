import React, { useState } from 'react'
import ReactQuill from 'react-quill'

import 'react-quill/dist/quill.snow.css'

import QuillToolbar, { formats, modules } from './toolbar'

export default function QuillEditor() {
	const [code, setCode] = useState(
		'hello guys you can also add fonts and another features to this editor.'
	)

	const handleProcedureContentChange = (content: string) => {
		setCode(content)
	}
	return (
		<>
			<QuillToolbar />
			<ReactQuill
				theme="snow"
				modules={modules}
				formats={formats}
				value={code}
				onChange={handleProcedureContentChange}
			/>
		</>
	)
}
