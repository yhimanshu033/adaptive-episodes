import React, { useRef } from 'react'
import { BubbleCheckIcon } from '@/icons/bubble-check-icon'
import { toast } from 'sonner'

import StreamedResponse from '@/components/ui/streamed-response'
import { TooltipComponent } from '@/components/ui/tooltip-component'

export default function Block({ data }: { data: string[] }) {
	const divRef = useRef<HTMLDivElement>(null)
	async function copyToClipboard() {
		let content = divRef.current?.innerText.slice(0, -4) || data.join('')
		content = content.trim()

		if (content.toLowerCase().endsWith('copy')) {
			content = content.slice(0, -4)
		}

		await navigator.clipboard.writeText(content)

		toast('Content copied successfully.', {
			icon: <BubbleCheckIcon />,
		})
	}

	if (!data.length || !data.join('').length) {
		return <br />
	}

	return (
		<TooltipComponent tooltip={'Click to copy block'} delayDuration={100}>
			<div
				onClick={() => void copyToClipboard()}
				ref={divRef}
				className="animate-fade-in-up group hover:text-fm-primary relative cursor-pointer rounded text-left transition-all hover:scale-[0.99] active:scale-[0.96]"
			>
				<StreamedResponse data={data} showCopyButton />
			</div>
		</TooltipComponent>
	)
}
