'use client'

import * as React from 'react'
import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import { Check, Minus } from 'lucide-react'

import IfElse from '@/components/if-else'
import { cn } from '@/lib/utils/helpers'

const Checkbox = React.forwardRef<
	React.ElementRef<typeof CheckboxPrimitive.Root>,
	React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> & {
		indeterminate?: boolean
	}
>(({ className, indeterminate, ...props }, ref) => (
	<CheckboxPrimitive.Root
		ref={ref}
		className={cn(
			'peer border-primary ring-offset-background focus-visible:ring-ring data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground size-4 shrink-0 rounded-sm border focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50',
			className
		)}
		{...props}
	>
		<CheckboxPrimitive.Indicator
			className={cn('flex items-center justify-center text-current')}
		>
			<IfElse
				condition={!!indeterminate}
				if={<Minus className="size-4" />}
				else={<Check className="size-4" />}
			/>
		</CheckboxPrimitive.Indicator>
	</CheckboxPrimitive.Root>
))

Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }
