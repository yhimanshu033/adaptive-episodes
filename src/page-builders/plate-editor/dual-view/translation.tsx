import React from 'react'
import { TRANSLATION_EDITOR_ID } from '@/constants/editor-constants'
import useEpisodeIdStore from '@/store/episode-id-store'
import {
	createPlateEditor,
	ParagraphPlugin,
	Plate,
} from '@udecode/plate-common/react'
import { useShallow } from 'zustand/react/shallow'

import { Editor } from '@/components/plate-ui/editor'

import { EDualVIewMode, TranslationProps } from '@/types/episode-type'

export default function Translation({ translatedContent }: TranslationProps) {
	const { store: useEpisodeIdStoreContext } = useEpisodeIdStore()
	const dualViewMode = useEpisodeIdStoreContext(
		useShallow((state) => state.dualViewMode)
	)
	const showTranslation = dualViewMode === EDualVIewMode.US_TRANSLATION
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

	if (!showTranslation) {
		return null
	}
	return (
		<Plate editor={editor}>
			<Editor focusRing={false} readOnly variant="ghost" size="md" />
		</Plate>
	)
}
