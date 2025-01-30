import React, { HTMLAttributes } from 'react'

import { Loader } from '@/components/loader'
import { cn } from '@/lib/utils/helpers'

export default function OverlayLoader({
	text = 'Bitte warten Sie, wir speichern Ihre Inhalte.',
	className,
	...props
}: { text?: string } & HTMLAttributes<HTMLDivElement>) {
	return (
		<div
			{...props}
			className={cn(
				'fixed right-0 top-0 z-[99] flex size-full flex-col items-center justify-center gap-12 bg-background/60',
				className
			)}
		>
			<Loader />
			<h2 className="text-2xl font-semibold">{text}</h2>
		</div>
	)
}
