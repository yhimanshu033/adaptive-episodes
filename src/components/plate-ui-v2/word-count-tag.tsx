import React, { useMemo } from 'react'
import useEditorData from '@/hooks/plate/use-editor-data'
import { useLocale, useTranslations } from 'next-intl'

import { Tag } from '@/components/aural-ui/tag'
import { cn } from '@/lib/aural-ui/utils'
import { prettifyNumber } from '@/lib/utils/helpers'

export default function WordCountTag() {
	const { editorText } = useEditorData()
	const locale = useLocale()
	const dict = useTranslations('placeholders')
	const wordCount = useMemo(() => {
		const words = editorText
			.trim()
			.split(/\s+/)
			.filter((w) => !!w.length).length
		return prettifyNumber(words, locale)
	}, [editorText, locale])

	if (wordCount === '0') {
		return null
	}

	return (
		<Tag
			size="sm"
			className={cn(
				'bg-fm-surface-primary fixed bottom-6 left-2 z-100 text-xs'
			)}
		>
			<span>{wordCount}</span>
			<span>{`${dict('words')}`}</span>
		</Tag>
	)
}
