import React, { ButtonHTMLAttributes, forwardRef } from 'react'
import { cva } from 'class-variance-authority'

import { FeatureShineIcon } from '../../icons/feature-shine-icon'
import { cn } from '../../lib/aural-ui/utils'
import { If } from './if-else'

export const buttonVariants = cva('group relative font-fm-brand', {
	variants: {
		variant: {
			primary:
				'before:absolute before:inset-0 before:rounded-full before:border-[length:var(--stroke-fm-xsm)] before:border-transparent before:[background-image:var(--button-fm-background),linear-gradient(to_top,color-mix(in_srgb,var(--color-fm-primary-600)_50%,_transparent))] text-fm-neutral-1100',
			secondary:
				'before:absolute before:inset-0 rounded-full before:border-[length:var(--stroke-fm-xsm)] before:border-transparent bg-fm-surface-secondary text-fm-primary',
			outline: 'text-fm-primary',
			text: 'bg-transparent text-fm-secondary-800',
			default: '',
		},
		disabled: {
			true: 'cursor-not-allowed',
			false: 'cursor-pointer',
		},
	},
	defaultVariants: {
		variant: 'primary',
		disabled: false,
	},
})

export const innerButtonVariants = cva(
	'flex items-center justify-center gap-2 rounded-full border-[length:var(--stroke-fm-xsm)] border-transparent transition-[_translate,_--gradientSizeX,_--gradientSizeY,_--gradientPositionY]',
	{
		variants: {
			variant: {
				primary:
					'shadow-[0_0_1.5rem_var(--color-fm-primary-400)_inset] group-active:translate-y-0 [--gradientSizeX:50%] [--gradientSizeY:150%] [--gradientPositionY:100%] hover:[--gradientSizeX:40%] hover:[--gradientSizeY:110%] hover:[--gradientPositionY:50%] [background-image:var(--button-fm-noise),_radial-gradient(ellipse_var(--gradientSizeX)_var(--gradientSizeY)_at_50%_var(--gradientPositionY),_var(--color-fm-primary-600),_var(--color-fm-secondary-300)),_linear-gradient(_to_top,_color-mix(in_srgb,var(--color-fm-primary-600)_50%,_transparent),_color-mix(in_srgb,var(--color-fm-primary-200)_50%,_transparent))] bg-cover bg-center [background-blend-mode:color-dodge,multiply,darken] duration-300 bg-repeat-x bg-auto bg-center bg-origin-border',
				secondary:
					'group-active:translate-y-0 bg-fm-button-fill-secondary [background-image:var(--button-fm-noise)] bg-repeat-x bg-auto bg-center bg-origin-border',
				outline:
					'border-[length:var(--stroke-fm-sm)] border-fm-divider-contrast !translate-y-0',
				text: '',
			},
			disabled: {
				default: '',
				primary:
					'bg-fm-surface-secondary [color:var(--color-fm-inactive)] border-[length:var(--stroke-fm-xsm)] border-fm-divider-tertiary',
				secondary:
					'bg-fm-surface-secondary [color:var(--color-fm-inactive)] border-[length:var(--stroke-fm-xsm)] border-fm-divider-tertiary',
				outline:
					'bg-fm-divider-tertiary [color:var(--color-fm-inactive)] border-[length:var(--stroke-fm-sm)] border-fm-divider-tertiary',
				text: 'bg-fm-divider-tertiary [color:var(--color-fm-inactive)] border-[length:var(--stroke-fm-sm)] border-fm-divider-tertiary',
			},
			size: {
				sm: 'py-fm-lg px-fm-2xl text-fm-sm -translate-y-1',
				md: 'py-fm-xl px-fm-4xl text-fm-md -translate-y-1',
				lg: 'py-fm-2xl px-fm-5xl text-fm-xl -translate-y-1.5',
			},
		},
		defaultVariants: {
			variant: 'primary',
			disabled: 'default',
			size: 'md',
		},
	}
)

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	children: React.ReactNode
	className?: string
	icon?: 'left' | 'right' | 'both'
	innerClassName?: string
	isDisabled?: boolean
	size?: 'sm' | 'md' | 'lg'
	variant?: 'primary' | 'secondary' | 'outline' | 'text'
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
	(
		{
			variant = 'primary',
			size = 'md',
			children,
			className = '',
			innerClassName = '',
			isDisabled = false,
			icon,
			...props
		},
		ref
	) => {
		const iconColor = isDisabled
			? 'var(--icon-fm-inactive)'
			: variant === 'text'
				? 'var(--color-fm-secondary-800)'
				: 'var(--color-fm-primary)'

		return (
			<button
				ref={ref}
				disabled={isDisabled}
				className={cn(
					buttonVariants({
						variant: isDisabled ? 'default' : variant,
						disabled: isDisabled,
					}),
					className
				)}
				{...props}
			>
				<span
					className={cn(
						innerButtonVariants({
							variant: isDisabled ? 'text' : variant,
							disabled: isDisabled ? variant : 'default',
							size,
						}),
						innerClassName
					)}
				>
					<If condition={icon === 'left' || icon === 'both'}>
						<FeatureShineIcon color={iconColor} />
					</If>
					{children}
					<If condition={icon === 'right' || icon === 'both'}>
						<FeatureShineIcon color={iconColor} />
					</If>
				</span>
			</button>
		)
	}
)
Button.displayName = 'Button'
