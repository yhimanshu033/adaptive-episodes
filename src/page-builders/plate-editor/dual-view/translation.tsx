import React from 'react'
import useMyEditor from '@/hooks/use-my-editor'
import useEpisodeIdStore from '@/store/episode-id-store'
import { Plate } from 'platejs/react'
import { useShallow } from 'zustand/react/shallow'

import { Editor } from '@/components/plate-ui-v2/editor'

import { EDualVIewMode, TranslationProps } from '@/types/episode-type'

export default function Translation({ translatedContent }: TranslationProps) {
	const { store: useEpisodeIdStoreContext } = useEpisodeIdStore()
	const dualViewMode = useEpisodeIdStoreContext(
		useShallow((state) => state.dualViewMode)
	)
	const showTranslation = dualViewMode === EDualVIewMode.US_TRANSLATION

	const editor = useMyEditor({
		content: translatedContent,
		simplified: true,
	})

	if (!showTranslation) {
		return null
	}
	return (
		<Plate editor={editor}>
			<Editor
				readOnly
				variant="aural"
				className="bg-fm-surface-primary text-fm-tertiary"
			/>
		</Plate>
	)
}
