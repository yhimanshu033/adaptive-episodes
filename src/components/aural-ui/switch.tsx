import * as React from 'react'
import * as SwitchPrimitives from '@radix-ui/react-switch'

import { cn } from '@/lib/aural-ui/utils'

const Switch = React.forwardRef<
	React.ElementRef<typeof SwitchPrimitives.Root>,
	React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
	<SwitchPrimitives.Root
		className={cn(
			'data-[state=checked]:not-[:disabled]:border-fm-divider-positive data-[state=checked]:not-[:disabled]:bg-fm-green-50 data-[state=unchecked]:not-[:disabled]:border-fm-divider-primary data-[state=unchecked]:not-[:disabled]:bg-fm-surface-primary data-[state=unchecked]:disabled:border-fm-divider-tertiary data-[state=unchecked]:disabled:bg-fm-surface-secondary data-[state=checked]:disabled:border-fm-green-100 data-[state=checked]:disabled:bg-fm-green-50 focus-visible:ring-fm-primary focus-visible:ring-offset-fm-green-50 hover:bg-fm-surface-secondary data-[state=unchecked]:not-[:disabled]:hover:bg-fm-surface-secondary h-8 w-14 rounded-full border border-solid transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
			'data-[state=unchecked]:not-[:disabled]:hover:border-fm-divider-primary relative disabled:cursor-not-allowed',
			className
		)}
		{...props}
		ref={ref}
	>
		<span
			className="font-fm-brand text-fm-positive data-[disabled=true]:text-fm-positive-tert absolute top-1/2 left-2 -translate-y-1/2 [font-size:var(--text-fm-sm)]"
			data-state={props.checked ? 'checked' : 'unchecked'}
			data-disabled={props.disabled || undefined}
		>
			ON
		</span>
		<span
			className="font-fm-brand text-fm-tertiary absolute top-1/2 right-1.5 -translate-y-1/2 [font-size:var(--text-fm-sm)]"
			data-state={props.checked ? 'checked' : 'unchecked'}
			data-disabled={props.disabled || undefined}
		>
			OFF
		</span>
		<SwitchPrimitives.Thumb className="bg-fm-icon-active data-[disabled]:bg-fm-icon-inactive pointer-events-none z-10 block size-6 rounded-full shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-7 data-[state=unchecked]:translate-x-1" />
	</SwitchPrimitives.Root>
))
Switch.displayName = SwitchPrimitives.Root.displayName

export { Switch }
