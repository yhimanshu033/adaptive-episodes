import React from 'react'
import useStreamedTTS from '@/hooks/mutation/use-streamed-tts'
import useIsGerman from '@/hooks/use-is-german'
import { Headphones } from 'lucide-react'

import IfElse from '@/components/if-else'
import { ToolbarButton } from '@/components/plate-ui/toolbar'

import CircularLoader from '../aural-ui/circular-loader'

export default function TtsToolbarButton() {
	const { mutate, isPending } = useStreamedTTS()
	const isGerman = useIsGerman()

	if (!isGerman) {
		return null
	}
	return (
		<ToolbarButton
			tooltip="Listen"
			disabled={isPending}
			onClick={() => mutate()}
		>
			<IfElse
				condition={isPending}
				if={<CircularLoader className="size-4" />}
				else={<Headphones className="size-4" />}
			/>
		</ToolbarButton>
	)
}
