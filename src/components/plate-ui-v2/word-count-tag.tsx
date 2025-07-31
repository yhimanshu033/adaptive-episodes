import React, { useMemo } from 'react'
import useEditorData from '@/hooks/plate/use-editor-data'
import { useEditorStore } from '@/store/editor-store'
import { useLocale, useTranslations } from 'next-intl'

import { Tag } from '@/components/aural-ui/tag'
import { cn } from '@/lib/aural-ui/utils'
import { prettifyNumber } from '@/lib/utils/helpers'

export default function WordCountTag() {
	const { editorText } = useEditorData()
	const locale = useLocale()
	const dict = useTranslations('placeholders')
	const isEpisodeNavigationOpen = useEditorStore(
		(state) => state.isEpisodeNavigationOpen
	)

	const wordCount = useMemo(() => {
		const words = editorText.trim().split(/\s+/).length
		return prettifyNumber(words, locale)
	}, [editorText, locale])

	if (wordCount === '0') {
		return null
	}

	return (
		<Tag
			size="sm"
			className={cn(
				'bg-fm-surface-primary fixed bottom-3 left-10 text-xs transition-all duration-300',
				{
					'left-35': isEpisodeNavigationOpen,
				}
			)}
		>
			<span>{wordCount}</span>
			<span>{`${dict('words')}`}</span>
		</Tag>
	)
}
