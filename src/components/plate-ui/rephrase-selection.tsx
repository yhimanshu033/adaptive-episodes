import React from 'react'
import useRephrase from '@/hooks/plate/use-rephrase'
import { Bot } from 'lucide-react'

import { ToolbarButton } from './toolbar'

export default function RephraseSelection() {
	const { onRephrase } = useRephrase()

	return (
		<ToolbarButton onClick={() => onRephrase('testing')} tooltip="Rephrase">
			<Bot />
		</ToolbarButton>
	)
}
