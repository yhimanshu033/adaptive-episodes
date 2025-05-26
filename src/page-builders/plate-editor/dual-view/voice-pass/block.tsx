import React from 'react'

import { TooltipComponent } from '@/components/ui/tooltip-component'

export default function Block({ data }: { data: string }) {
	function copyToClipboard() {
		void navigator.clipboard.writeText(data)
	}

	if (!data) {
		return <br />
	}
	return (
		<TooltipComponent tooltip={'Click to copy block'} delayDuration={100}>
			<div
				onClick={copyToClipboard}
				className="group relative cursor-pointer rounded text-left transition-all hover:scale-[0.99] active:scale-[0.96]"
			>
				{data}
				<div className="bg-popover text-popover-foreground pointer-events-none absolute top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-md border px-3 py-1.5 text-sm opacity-0 shadow-md transition-all delay-500 duration-1000 group-active:top-0 group-active:-translate-y-full group-active:opacity-100 group-active:delay-0 group-active:duration-100">
					Copied to clipboard!
				</div>
			</div>
		</TooltipComponent>
	)
}
