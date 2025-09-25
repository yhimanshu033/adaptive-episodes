import React from 'react'
import useEditorData from '@/hooks/plate/use-editor-data'
import { useTranslations } from 'next-intl'

import { Tag } from '@/components/aural-ui/tag'
import { cn } from '@/lib/aural-ui/utils'

export default function WordCountTag() {
	const { wordCount } = useEditorData()
	const dict = useTranslations('placeholders')

	if (wordCount.value === 0) {
		return null
	}

	return (
		<Tag
			size="sm"
			className={cn(
				'bg-fm-surface-primary fixed bottom-6 left-2 z-100 text-xs'
			)}
		>
			<span>{wordCount.display}</span>
			<span>{`${dict('words')}`}</span>
		</Tag>
	)
}
