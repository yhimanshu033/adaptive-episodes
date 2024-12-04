import React from 'react'
import { TRANSLATION_EDITOR_ID } from '@/constants/editor-constants'
import { useMyEditor } from '@/page-builders/plate-editor/editor'
import usePlateStore from '@/store/plate-store'
import { Plate } from '@udecode/plate-common/react'

import { Editor } from '@/components/plate-ui/editor'
import { cn } from '@/lib/utils'

const Translation = ({ translatedContent }: { translatedContent: string }) => {
	const editor = useMyEditor({
		content: translatedContent,
		id: TRANSLATION_EDITOR_ID,
	})

	const sidebar = usePlateStore((state) => state.sidebar)
	const showTranslation = sidebar === 'translation'
	if (sidebar && !showTranslation) return null
	return (
		<div
			className={cn(
				'~ease-in-out flex w-full transition-all',
				!showTranslation ? 'max-w-0' : 'max-w-[45vw] duration-500'
			)}
		>
			{showTranslation && (
				<Plate editor={editor}>
					<Editor
						className="rounded-none border-l px-12 py-5"
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
