import React, { useMemo } from 'react'
import useSocketStreaming from '@/hooks/use-socket-streaming'
import { BubbleCheckIcon } from '@/icons/bubble-check-icon'
import { Copy } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/aural-ui/button'

export default function CopyAll({
	id,
	streamedData,
}: {
	id?: string
	streamedData: string[]
}) {
	const { taskEnded } = useSocketStreaming()

	const isEnded = useMemo(() => !!(id && taskEnded[id]), [id, taskEnded])

	async function copyAll() {
		await navigator.clipboard.writeText(streamedData.join('\n'))

		toast('Content copied successfully.', {
			icon: <BubbleCheckIcon />,
		})
	}

	if (!isEnded) {
		return null
	}

	return (
		<div className="fixed top-[63px] right-3 z-20 text-right">
			<div className="inline-flex h-22 w-40 items-center justify-end [background-image:linear-gradient(220deg,_var(--color-fm-surface-primary)_60.54%,_var(--color-fm-surface-primary-alpha-15)_79.18%)]">
				<Button
					onClick={() => void copyAll()}
					tooltip="Copy All"
					variant="text"
					className="group w-full"
					innerClassName="hover:bg-fm-secondary-50 rounded-md translate-y-0"
				>
					<Copy className="size-4" />
					Copy All
				</Button>
			</div>
		</div>
	)
}
