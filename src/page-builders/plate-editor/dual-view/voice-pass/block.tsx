import React, { useRef } from 'react'

import StreamedResponse from '@/components/ui/streamed-response'
import { TooltipComponent } from '@/components/ui/tooltip-component'

export default function Block({ data }: { data: string[] }) {
	const divRef = useRef<HTMLDivElement>(null)
	function copyToClipboard() {
		void navigator.clipboard.writeText(
			divRef.current?.innerText || data.join('')
		)
	}

	if (!data.length || !data.join('').length) {
		return <br />
	}
	return (
		<TooltipComponent tooltip={'Click to copy block'} delayDuration={100}>
			<div
				onClick={copyToClipboard}
				ref={divRef}
				className="group animate-fade-in-up relative cursor-pointer rounded text-left transition-all hover:scale-[0.99] active:scale-[0.96]"
			>
				<StreamedResponse data={data} />
				<div className="bg-popover text-popover-foreground pointer-events-none absolute top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-md border px-3 py-1.5 text-sm opacity-0 shadow-md transition-all delay-500 duration-1000 group-active:top-0 group-active:-translate-y-full group-active:opacity-100 group-active:delay-0 group-active:duration-100">
					Copied to clipboard!
				</div>
			</div>
		</TooltipComponent>
	)
}
