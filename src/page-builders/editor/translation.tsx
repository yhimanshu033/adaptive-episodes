import React from 'react'

const Translation = ({ translatedContent }: { translatedContent: string }) => {
	return (
		<div
			className="flex w-full rounded-md bg-background-editor p-4 shadow-editor focus:outline-none"
			contentEditable
			suppressContentEditableWarning={true}
			dangerouslySetInnerHTML={{
				__html: translatedContent,
			}}
		/>
	)
}

export default Translation
