import * as React from 'react'
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group'

import { cn } from '@/lib/aural-ui/utils'

const RadioGroup = React.forwardRef<
	React.ElementRef<typeof RadioGroupPrimitive.Root>,
	React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => {
	return (
		<RadioGroupPrimitive.Root
			className={cn('grid gap-2', className)}
			{...props}
			ref={ref}
		/>
	)
})
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName

const RadioGroupItem = React.forwardRef<
	React.ElementRef<typeof RadioGroupPrimitive.Item>,
	React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, ...props }, ref) => {
	return (
		<RadioGroupPrimitive.Item
			ref={ref}
			className={cn(
				'data-[state=checked]:not-[:disabled]:border-fm-divider-positive data-[state=checked]:not-[:disabled]:bg-fm-green-50 data-[state=unchecked]:not-[:disabled]:border-fm-divider-primary data-[state=unchecked]:not-[:disabled]:bg-fm-surface-primary data-[state=unchecked]:disabled:border-fm-divider-tertiary data-[state=unchecked]:disabled:bg-fm-surface-secondary data-[state=checked]:disabled:border-fm-green-100 data-[state=checked]:disabled:bg-fm-green-50 text-fm-icon-active disabled:text-fm-icon-inactive focus-visible:ring-fm-primary focus-visible:ring-offset-fm-green-50 hover:bg-fm-surface-secondary data-[state=unchecked]:not-[:disabled]:hover:bg-fm-surface-secondary size-8 rounded-full border border-solid transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
				'data-[state=unchecked]:not-[:disabled]:hover:border-fm-divider-primary disabled:cursor-not-allowed',
				className
			)}
			{...props}
		>
			<RadioGroupPrimitive.Indicator className="flex items-center justify-center">
				<span className="size-4 rounded-full bg-current transition-all duration-200" />
			</RadioGroupPrimitive.Indicator>
		</RadioGroupPrimitive.Item>
	)
})
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName

export { RadioGroup, RadioGroupItem }
