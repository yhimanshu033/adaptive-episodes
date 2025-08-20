import * as React from 'react'
import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area'

import { cn } from '@/lib/aural-ui/utils'

function ScrollArea({
	className,
	classes = {},
	children,
	orientation = 'vertical',
	viewportRef,
	...props
}: React.ComponentProps<typeof ScrollAreaPrimitive.Root> & {
	viewportRef?: React.LegacyRef<HTMLDivElement> | undefined
} & {
	classes?: {
		corner?: string
		root?: string
		scrollbar?: string
		thumb?: string
		viewport?: string
	}
	orientation?: 'vertical' | 'horizontal'
}) {
	return (
		<ScrollAreaPrimitive.Root
			data-slot="scroll-area"
			className={cn('relative', className, classes?.root)}
			{...props}
		>
			<ScrollAreaPrimitive.Viewport
				ref={viewportRef}
				data-slot="scroll-area-viewport"
				className={cn(
					'focus-visible:ring-fm-secondary-1000/50 size-full rounded-[inherit] transition-[color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:outline-1 [&>div]:w-full [&>div]:table-fixed',
					classes.viewport
				)}
			>
				{children}
			</ScrollAreaPrimitive.Viewport>
			<ScrollBar orientation={orientation} className={classes.scrollbar} />
			<ScrollAreaPrimitive.Corner className={classes.corner} />
		</ScrollAreaPrimitive.Root>
	)
}

function ScrollBar({
	className,
	orientation = 'vertical',
	...props
}: React.ComponentProps<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>) {
	return (
		<ScrollAreaPrimitive.ScrollAreaScrollbar
			data-slot="scroll-area-scrollbar"
			orientation={orientation}
			className={cn(
				'flex touch-none p-px transition-colors select-none',
				orientation === 'vertical' &&
					'h-full w-2.5 border-l border-l-transparent',
				orientation === 'horizontal' &&
					'h-2.5 flex-col border-t border-t-transparent',
				className
			)}
			{...props}
		>
			<ScrollAreaPrimitive.ScrollAreaThumb
				data-slot="scroll-area-thumb"
				className="bg-border relative flex-1 rounded-full"
			/>
		</ScrollAreaPrimitive.ScrollAreaScrollbar>
	)
}

export { ScrollArea, ScrollBar }
