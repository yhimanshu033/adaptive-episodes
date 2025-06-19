import React, { useMemo } from 'react'
import useSocketStreaming from '@/hooks/use-socket-streaming'
import { Copy } from 'lucide-react'

import { IconButton } from '@/components/aural-ui/icon-button'

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
		<IconButton
			onClick={copyAll}
			tooltip="Copy All"
			variant="ghost"
			className="pointer-events-[all] sticky top-16 left-4 z-20 mt-4 ml-4"
			icon={<Copy className="h-4 w-4" />}
			label="Copy All"
		/>
	)
}
