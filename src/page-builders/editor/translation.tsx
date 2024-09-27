import React from 'react'

const Translation = () => {
	return (
		<div
			className="flex-1 rounded-md bg-background-editor p-4 shadow-editor focus:outline-none focus:ring-2 focus:ring-blue-500"
			contentEditable
			suppressContentEditableWarning={true}
		>
			Translate text.....
		</div>
	)
}

export default Translation
