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
				className="animate-fade-in-up group relative cursor-pointer rounded text-left transition-all hover:scale-[0.99] active:scale-[0.96]"
			>
				<StreamedResponse data={data} />
				<div className="bg-fm-surface-secondary text-fm-primary rounded-fm-s leading-fm-sm font-fm-text pointer-events-none absolute top-1/2 left-1/2 z-50 min-h-11 -translate-x-1/2 -translate-y-1/2 overflow-hidden bg-[radial-gradient(70.39%_86.36%_at_50%_97.73%,var(--color-fm-secondary-200)_0%,rgba(29,29,29,0.02)_100%)] p-3 [font-size:var(--text-fm-sm)] opacity-0 shadow-md transition-all delay-500 duration-1000 group-active:top-0 group-active:-translate-y-full group-active:opacity-100 group-active:delay-0 group-active:duration-100">
					Copied to clipboard!
				</div>
			</div>
		</TooltipComponent>
	)
}
