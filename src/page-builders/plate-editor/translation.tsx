import React from 'react'
import { TRANSLATION_EDITOR_ID } from '@/constants/editor-constants'
import { useMyEditor } from '@/page-builders/plate-editor/editor'
import usePlateStore from '@/store/plate-store'
import { Plate } from '@udecode/plate-common/react'

import { Editor } from '@/components/plate-ui/editor'

const Translation = ({ translatedContent }: { translatedContent: string }) => {
	const editor = useMyEditor({
		content: translatedContent,
		id: TRANSLATION_EDITOR_ID,
	})

	const isTranslationOpen = usePlateStore((state) => state.isTranslationOpen)

	if (!isTranslationOpen) return null
	return (
		<div className="flex w-full border-r">
			<Plate editor={editor}>
				<Editor
					className="min-h-[calc(60vh-44px)] p-12"
					autoFocus
					focusRing={false}
					readOnly
					variant="ghost"
					size="md"
				/>
			</Plate>
		</div>
	)
}

export default Translation
