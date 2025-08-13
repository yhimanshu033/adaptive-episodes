import * as React from 'react'
import * as SwitchPrimitives from '@radix-ui/react-switch'

import { cn } from '../../lib/aural-ui/utils'

type SwitchWithIconsProps = React.ComponentPropsWithoutRef<
	typeof SwitchPrimitives.Root
> & {
	offIcon?: React.ReactNode
	onIcon?: React.ReactNode
}

const Switch = React.forwardRef<
	React.ElementRef<typeof SwitchPrimitives.Root>,
	SwitchWithIconsProps
>(({ className, onIcon, offIcon, checked, disabled, ...props }, ref) => (
	<SwitchPrimitives.Root
		ref={ref}
		checked={checked}
		disabled={disabled}
		className={cn(
			'data-[state=checked]:not-[:disabled]:border-fm-divider-positive data-[state=checked]:not-[:disabled]:bg-fm-green-50',
			'data-[state=unchecked]:not-[:disabled]:border-fm-divider-primary data-[state=unchecked]:not-[:disabled]:bg-fm-surface-primary',
			'data-[state=unchecked]:disabled:border-fm-divider-tertiary data-[state=unchecked]:disabled:bg-fm-surface-secondary',
			'data-[state=checked]:disabled:border-fm-green-100 data-[state=checked]:disabled:bg-fm-green-50',
			'focus-visible:ring-fm-primary focus-visible:ring-offset-fm-green-50',
			'hover:bg-fm-surface-secondary data-[state=unchecked]:not-[:disabled]:hover:bg-fm-surface-secondary',
			'data-[state=unchecked]:not-[:disabled]:hover:border-fm-divider-primary',
			'relative h-8 w-14 rounded-full border border-solid transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed',
			className
		)}
		{...props}
	>
		<span
			className={cn(
				'font-fm-brand text-fm-positive absolute top-1/2 left-2 -translate-y-1/2 [font-size:var(--text-fm-sm)]',
				disabled && 'text-fm-positive-tert'
			)}
			data-state={checked ? 'checked' : 'unchecked'}
			data-disabled={disabled || undefined}
		>
			{onIcon ?? 'ON'}
		</span>

		<span
			className="font-fm-brand text-fm-tertiary absolute top-1/2 right-1.5 -translate-y-1/2 [font-size:var(--text-fm-sm)]"
			data-state={checked ? 'checked' : 'unchecked'}
			data-disabled={disabled || undefined}
		>
			{offIcon ?? 'OFF'}
		</span>

		<SwitchPrimitives.Thumb className="bg-fm-icon-active data-[disabled]:bg-fm-icon-inactive pointer-events-none z-10 block size-6 rounded-full shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-7 data-[state=unchecked]:translate-x-1" />
	</SwitchPrimitives.Root>
))
Switch.displayName = SwitchPrimitives.Root.displayName

export { Switch }
