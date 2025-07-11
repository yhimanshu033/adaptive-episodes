import React, { useMemo } from 'react'
import { WholeWordIcon } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { useEditorString } from 'platejs/react'

import { prettifyNumber } from '@/lib/utils/helpers'

import { ToolbarButton } from '../plate-ui-v2/toolbar'
import { Tooltip } from '../plate-ui-v2/tooltip'
import { TooltipComponent } from '../ui/tooltip-component'

export default function WordCountButton() {
	const editorText = useEditorString()
	console.log(editorText)
	const locale = useLocale()
	const dict = useTranslations('placeholders')

	const wordCount = useMemo(() => {
		const words = editorText
			.split(/\s+/)
			.filter((word) => word.length > 0).length
		return prettifyNumber(words, locale)
	}, [editorText, locale])

	return (
		<TooltipComponent tooltip={`${dict('words')}: ${wordCount}`}>
			<div className="flex items-center p-1">
				<WholeWordIcon className="size-5" />:
				<span className="ml-1">{wordCount}</span>
			</div>
		</TooltipComponent>
	)
}
