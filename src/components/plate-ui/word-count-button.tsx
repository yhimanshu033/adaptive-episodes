import React, { useMemo } from 'react'
import { useEditorState } from '@udecode/plate-common/react'
import { WholeWordIcon } from 'lucide-react'

import { TooltipComponent } from '@/components/ui/tooltip-component'
import { prettifyNumber } from '@/lib/utils/helpers'
import { getWordCount } from '@/lib/utils/plate'

export default function WordCountButton() {
	const { children } = useEditorState()
	const wordCount = useMemo(() => {
		const words = getWordCount(children)
		return prettifyNumber(words)
	}, [children])
	return (
		<TooltipComponent tooltip={`Worte: ${wordCount}`}>
			<div className="flex items-center p-1">
				<WholeWordIcon className="size-5" />:
				<span className="ml-1">{wordCount}</span>
			</div>
		</TooltipComponent>
	)
}
