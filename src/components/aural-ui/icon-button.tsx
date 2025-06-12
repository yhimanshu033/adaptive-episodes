import React, { forwardRef } from 'react'
import { AccessibleIcon } from '@radix-ui/react-accessible-icon'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '../../lib/aural-ui/utils'
import { withTooltip } from './tooltip'

// Define variants with class-variance-authority
const iconButtonVariants = cva(
	// Base styles for all icon buttons
	'inline-flex items-center justify-center transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-fm-primary focus-visible:ring-offset-fm-neutral-0 text-fm-icon-active disabled:text-fm-icon-inactive',
	{
		variants: {
			variant: {
				// With background variants
				background:
					'bg-fm-button-fill-secondary hover:bg-fm-neutral-300 disabled:bg-fm-surface-secondary',
				// Without background variants
				ghost:
					'bg-transparent hover:bg-fm-button-shadow-secondary disabled:bg-transparent',
				// Outlined variants
				outlined:
					'border border-solid border-fm-divider-primary hover:border-fm-button-stroke disabled:border-fm-divider-tertiary',
			},
			size: {
				small: 'size-8', // 32px
				medium: 'size-11', // 44px
				large: 'size-14', // 56px
			},
			shape: {
				square: 'rounded-fm-s',
				circle: 'rounded-full',
			},
			disabled: {
				true: 'cursor-not-allowed',
				false: 'cursor-pointer',
			},
		},
		defaultVariants: {
			variant: 'background',
			size: 'medium',
			shape: 'circle',
			disabled: false,
		},
	}
)

// Determine the icon size based on button size
export const getIconSize = (size: 'small' | 'large' | 'medium') => {
	switch (size) {
		case 'small':
			return 16
		case 'large':
			return 32
		case 'medium':
			return 20
		default:
			return 20
	}
}

interface IconButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement>,
		Omit<VariantProps<typeof iconButtonVariants>, 'disabled'> {
	// Accessible label for the button
	className?: string
	icon: React.ReactNode | SVGSVGElement
	label: string
	tooltip?: React.ReactNode
}

const IconButtonComp = forwardRef<HTMLButtonElement, IconButtonProps>(
	(
		{
			className,
			variant,
			size,
			shape,
			disabled = false,
			icon,
			label,
			type = 'button',
			children,
			...props
		},
		ref
	) => {
		const iconSize = getIconSize(size ?? 'medium')

		return (
			<button
				type={type}
				disabled={disabled}
				className={cn(
					iconButtonVariants({
						variant,
						size,
						shape,
						disabled,
					}),
					className
				)}
				ref={ref}
				aria-label={label}
				{...props}
			>
				{React.isValidElement(children) && children}
				{React.isValidElement(icon) && (
					<AccessibleIcon label={label}>
						{/* Clone the icon with the size props if it's an SVG */}

						{React.cloneElement(icon, {
							width:
								(icon.props as React.SVGProps<SVGSVGElement>).width || iconSize,
							height:
								(icon.props as React.SVGProps<SVGSVGElement>).height ||
								iconSize,
							...(icon.props as React.SVGProps<SVGSVGElement>),
						})}
					</AccessibleIcon>
				)}
			</button>
		)
	}
)

const IconButton = withTooltip(IconButtonComp)

IconButtonComp.displayName = 'IconButton'

export { IconButton, iconButtonVariants }
export type { IconButtonProps }
