import React from 'react'
import { TRANSLATION_EDITOR_ID } from '@/constants/editor-constants'
import usePlateStore from '@/store/plate-store'
import {
	createPlateEditor,
	ParagraphPlugin,
	Plate,
} from '@udecode/plate-common/react'

import { Editor } from '@/components/plate-ui/editor'
import { cn } from '@/lib/utils/helpers'

import { ESidebar } from '@/types/plate-types'

const Translation = ({ translatedContent }: { translatedContent: string }) => {
	const editor = createPlateEditor({
		value:
			typeof translatedContent === 'string'
				? [
						{
							id: `0`,
							type: ParagraphPlugin.key,
							children: [{ text: translatedContent }],
						},
					]
				: translatedContent,
		id: TRANSLATION_EDITOR_ID,
	})

	const { store } = usePlateStore()
	const sidebar = store((state) => state.sidebar)
	const showTranslation = sidebar === ESidebar.TRANSLATION
	if (sidebar && !showTranslation) return null
	return (
		<div
			className={cn(
				'flex w-full transition-all duration-200',
				!showTranslation ? 'max-w-0' : 'max-w-[45vw] pl-5'
			)}
		>
			{showTranslation && (
				<Plate editor={editor}>
					<Editor
						className="rounded-none border px-12 py-6"
						autoFocus
						focusRing={false}
						readOnly
						variant="ghost"
						size="md"
					/>
				</Plate>
			)}
		</div>
	)
}

export default Translation
