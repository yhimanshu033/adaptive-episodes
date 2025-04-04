import React from 'react'
import useStreamedTTS from '@/hooks/mutation/use-streamed-tts'
import { Mic } from 'lucide-react'

import IfElse from '@/components/if-else'
import { ToolbarButton } from '@/components/plate-ui/toolbar'
import Spinner from '@/components/ui/spinner'

export default function TtsToolbarButton() {
	const { mutate, isPending } = useStreamedTTS()
	return (
		<ToolbarButton
			tooltip="Listen"
			disabled={isPending}
			onClick={() => mutate()}
		>
			<IfElse
				condition={isPending}
				if={<Spinner className="size-4" />}
				else={<Mic className="size-4" />}
			/>
		</ToolbarButton>
	)
}
