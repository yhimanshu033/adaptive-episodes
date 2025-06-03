import * as React from 'react'
import * as PopoverPrimitive from '@radix-ui/react-popover'

import { cn } from '../../lib/aural-ui/utils'

function Popover({
	...props
}: React.ComponentProps<typeof PopoverPrimitive.Root>) {
	return <PopoverPrimitive.Root data-slot="popover" {...props} />
}

function PopoverTrigger({
	...props
}: React.ComponentProps<typeof PopoverPrimitive.Trigger>) {
	return <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />
}

function PopoverContent({
	className,
	align = 'center',
	sideOffset = 4,
	...props
}: React.ComponentProps<typeof PopoverPrimitive.Content>) {
	return (
		<PopoverPrimitive.Portal>
			<PopoverPrimitive.Content
				data-slot="popover-content"
				align={align}
				sideOffset={sideOffset}
				className={cn(
					'bg-fm-surface-frosted/20 popover-content relative z-50 max-h-96 w-72 origin-(--radix-popover-content-transform-origin) outline-hidden backdrop-blur-lg',
					className
				)}
				{...props}
			>
				<div className="absolute top-0 right-0 left-0 block h-0.5 w-full bg-(image:--gradient-fm-stroke-neutral)" />
				{props.children}
			</PopoverPrimitive.Content>
		</PopoverPrimitive.Portal>
	)
}

function PopoverAnchor({
	...props
}: React.ComponentProps<typeof PopoverPrimitive.Anchor>) {
	return <PopoverPrimitive.Anchor data-slot="popover-anchor" {...props} />
}

function PopoverClose({
	...props
}: React.ComponentProps<typeof PopoverPrimitive.Close>) {
	return <PopoverPrimitive.Close data-slot="popover-close" {...props} />
}

function PopoverArrow({
	...props
}: React.ComponentProps<typeof PopoverPrimitive.Arrow>) {
	return <PopoverPrimitive.Arrow data-slot="popover-arror" {...props} />
}

export {
	Popover,
	PopoverTrigger,
	PopoverContent,
	PopoverAnchor,
	PopoverClose,
	PopoverArrow,
}
