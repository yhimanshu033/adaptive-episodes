import React, { useMemo } from 'react'
import { useEditorStore } from '@/store/editor-store'
import { useLocale, useTranslations } from 'next-intl'
import { useEditorString } from 'platejs/react'

import { Tag } from '@/components/aural-ui/tag'
import { cn } from '@/lib/aural-ui/utils'
import { prettifyNumber } from '@/lib/utils/helpers'

export default function WordCountTag() {
	const editorText = useEditorString()
	const locale = useLocale()
	const dict = useTranslations('placeholders')
	const isEpisodeNavigationOpen = useEditorStore(
		(state) => state.isEpisodeNavigationOpen
	)

	const wordCount = useMemo(() => {
		const words = editorText
			.split(/\s+/)
			.filter((word) => word.length > 0).length
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
