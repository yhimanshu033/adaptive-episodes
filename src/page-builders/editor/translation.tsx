import React from 'react'

const Translation = ({ translatedContent }: { translatedContent: string }) => {
	return (
		<div
			className="flex-1 rounded-br-md border-l bg-background-editor p-4 focus:outline-none"
			contentEditable
			suppressContentEditableWarning={true}
			dangerouslySetInnerHTML={{
				__html: translatedContent,
			}}
		/>
	)
}

export default Translation
