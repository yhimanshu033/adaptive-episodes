import * as React from 'react'
import { TickIcon } from '@/icons/tick-icon'
import * as CheckboxPrimitive from '@radix-ui/react-checkbox'

import { cn } from '@/lib/aural-ui/utils'

type CheckboxProps = React.ComponentPropsWithoutRef<
	typeof CheckboxPrimitive.Root
> & {
	indeterminate?: boolean
}

const Checkbox = React.forwardRef<
	React.ElementRef<typeof CheckboxPrimitive.Root>,
	CheckboxProps
>(({ className, indeterminate = false, ...props }, ref) => (
	<CheckboxPrimitive.Root
		ref={ref}
		className={cn(
			'data-[state=checked]:not-[:disabled]:border-fm-divider-positive data-[state=checked]:not-[:disabled]:bg-fm-green-50 data-[state=unchecked]:not-[:disabled]:border-fm-divider-primary data-[state=unchecked]:not-[:disabled]:bg-fm-surface-primary data-[state=unchecked]:disabled:border-fm-divider-tertiary data-[state=unchecked]:disabled:bg-fm-surface-secondary data-[state=checked]:disabled:border-fm-green-100 data-[state=checked]:disabled:bg-fm-green-50 text-fm-icon-active disabled:text-fm-icon-inactive focus-visible:ring-fm-primary focus-visible:ring-offset-fm-green-50 hover:bg-fm-surface-secondary data-[state=unchecked]:not-[:disabled]:hover:bg-fm-surface-secondary rounded-fm-l size-8 border border-solid transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
			'data-[state=unchecked]:not-[:disabled]:hover:border-fm-divider-primary disabled:cursor-not-allowed',
			className
		)}
		{...props}
	>
		<CheckboxPrimitive.Indicator className="flex items-center justify-center text-current">
			{indeterminate ? <span className="h-0.5 w-4 bg-current" /> : <TickIcon />}
		</CheckboxPrimitive.Indicator>
	</CheckboxPrimitive.Root>
))
Checkbox.displayName = CheckboxPrimitive.Root.displayName

// Add a custom prop type for the indeterminate state
export type { CheckboxProps }
export { Checkbox }
