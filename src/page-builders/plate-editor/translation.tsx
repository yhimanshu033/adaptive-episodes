import React from 'react'
import { TRANSLATION_EDITOR_ID } from '@/constants/editor-constants'
import LocalDiffSection from '@/page-builders/plate-editor/local-diff'
import usePlateStore from '@/store/plate-store'
import {
	createPlateEditor,
	ParagraphPlugin,
	Plate,
} from '@udecode/plate-common/react'
import { useShallow } from 'zustand/react/shallow'

import CloseSidebar from '@/components/close-sidebar'
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

	const { store: useEpisodePlateStore } = usePlateStore()
	const localDiffValue = useEpisodePlateStore(
		useShallow((state) => state.localDiffValue)
	)
	const sidebar = useEpisodePlateStore(useShallow((state) => state.sidebar))

	const isTranslation = sidebar === ESidebar.TRANSLATION
	const isLocalDiff = sidebar === ESidebar.LOCAL_DIFF && !!localDiffValue

	const showDualView = isTranslation || isLocalDiff
	if (sidebar && !showDualView) return null
	return (
		<div
			className={cn(
				'relative flex w-full transition-all duration-200',
				!showDualView ? 'max-w-0' : 'max-w-[45vw]'
			)}
		>
			{isTranslation && (
				<Plate editor={editor}>
					<Editor
						className="rounded-none border-l px-12 py-6"
						autoFocus
						focusRing={false}
						readOnly
						variant="ghost"
						size="md"
					/>
					<CloseSidebar />
				</Plate>
			)}
			{isLocalDiff && <LocalDiffSection />}
		</div>
	)
}

export default Translation
