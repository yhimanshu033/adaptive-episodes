import React, { useMemo } from 'react'
import useSocketStreaming from '@/hooks/use-socket-streaming'
import { Copy } from 'lucide-react'

import { Button } from '@/components/ui/button'

export default function CopyAll({
	id,
	streamedData,
}: {
	id?: string
	streamedData: string[]
}) {
	const { taskEnded } = useSocketStreaming()

	const isEnded = useMemo(() => !!(id && taskEnded[id]), [id, taskEnded])

	function copyAll() {
		void navigator.clipboard.writeText(streamedData.join('\n'))
	}

	if (!isEnded) {
		return null
	}

	return (
		<Button
			onClick={copyAll}
			tooltip="Copy All"
			size="icon"
			className="pointer-events-[all] bg-background/30 sticky left-4 top-16 z-20 ml-4 mt-4 backdrop-blur-[1px]"
		>
			<Copy />
		</Button>
	)
}
