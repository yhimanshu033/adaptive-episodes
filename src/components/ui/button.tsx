'use client'

import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { type VariantProps } from 'class-variance-authority'

import { withTooltip } from '@/components/plate-ui/tooltip'
import { buttonVariants, cn } from '@/lib/utils/helpers'

export interface ButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof buttonVariants> {
	asChild?: boolean
}

const Button = withTooltip(
	// eslint-disable-next-line react/display-name
	React.forwardRef<HTMLButtonElement, ButtonProps>(
		({ className, variant, size, asChild = false, ...props }, ref) => {
			const Comp = asChild ? Slot : 'button'
			return (
				<Comp
					className={cn(buttonVariants({ variant, size, className }))}
					ref={ref}
					{...props}
				/>
			)
		}
	)
)
Button.displayName = 'Button'

export { Button, buttonVariants }
