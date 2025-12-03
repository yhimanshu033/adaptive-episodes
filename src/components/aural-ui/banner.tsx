/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
import React, { forwardRef } from 'react'
import { cva } from 'class-variance-authority'

import { ArrowRightIcon } from '../../icons/arrow-right-icon'
import { FeatureShineIcon } from '../../icons/feature-shine-icon'
import { cn } from '../../lib/aural-ui/utils'

interface BannerProps {
	/**
	 * Whether the banner is filled or outlined
	 */
	appearance?: 'filled' | 'outlined'
	/**
	 * Optional className for custom styling
	 */
	className?: string
	/**
	 * The title of the banner
	 */
	heading?: string | React.ReactNode
	/**
	 * Icon properties for the left and right icons
	 */
	iconProps?: React.SVGProps<SVGSVGElement>
	/**
	 * Whether to show the arrow icon
	 */
	leftIcon?: boolean | React.ReactNode
	/**
	 * Optional click handler
	 */
	onClick?: () => void
	/**
	 * The body text of the banner
	 */
	paragraph?: string | React.ReactNode
	/**
	 * Whether to show the left icon
	 */
	rightIcon?: boolean | React.ReactNode
	/**
	 * The variant of the banner
	 */
	variant?: 'positive' | 'negative' | 'warning' | 'info'
}

// Create the banner variants using class-variance-authority
export const bannerVariants = cva(
	'flex items-center p-fm-lg rounded-fm-s transition-colors relative min-w-80 gap-2',
	{
		variants: {
			variant: {
				positive: '',
				negative: '',
				warning: '',
				info: '',
			},
			appearance: {
				filled: '',
				outlined:
					'border border-solid border-fm-divider-secondary bg-fm-surface-secondary',
			},
		},
		compoundVariants: [
			// Filled variants
			{
				variant: 'positive',
				appearance: 'filled',
				className: 'bg-fm-surface-positive text-fm-positive-tert',
			},
			{
				variant: 'negative',
				appearance: 'filled',
				className: 'bg-fm-surface-negative text-fm-negative-tert',
			},
			{
				variant: 'warning',
				appearance: 'filled',
				className: 'bg-fm-surface-warning text-fm-warning-tert',
			},
			{
				variant: 'info',
				appearance: 'filled',
				className: 'bg-fm-surface-info text-fm-info-tert',
			},
			// Outlined variants
			{
				variant: 'positive',
				appearance: 'outlined',
				className:
					'bg-(image:--gradient-fm-banner-positive) text-fm-positive-sec',
			},
			{
				variant: 'negative',
				appearance: 'outlined',
				className:
					'bg-(image:--gradient-fm-banner-negative) text-fm-negative-sec',
			},
			{
				variant: 'warning',
				appearance: 'outlined',
				className:
					'bg-(image:--gradient-fm-banner-warning) text-fm-warning-sec',
			},
			{
				variant: 'info',
				appearance: 'outlined',
				className: 'bg-(image:--gradient-fm-banner-info) text-fm-info-sec',
			},
		],
		defaultVariants: {
			variant: 'info',
			appearance: 'filled',
		},
	}
)

export const borderVariants = cva('', {
	variants: {
		variant: {
			positive: '',
			negative: '',
			warning: '',
			info: '',
		},
		appearance: {
			filled: 'hidden',
			outlined: 'absolute w-full left-0 right-0 bottom-0 h-0.5 block',
		},
	},
	compoundVariants: [
		// Outlined variants
		{
			variant: 'positive',
			appearance: 'outlined',
			className: 'bg-(image:--gradient-fm-stroke-positive)',
		},
		{
			variant: 'negative',
			appearance: 'outlined',
			className: 'bg-(image:--gradient-fm-stroke-negative)',
		},
		{
			variant: 'warning',
			appearance: 'outlined',
			className: 'bg-(image:--gradient-fm-stroke-warning)',
		},
		{
			variant: 'info',
			appearance: 'outlined',
			className: 'bg-(image:--gradient-fm-stroke-info)',
		},
	],
	defaultVariants: {
		variant: 'info',
		appearance: 'outlined',
	},
})

export const Banner = forwardRef<HTMLDivElement, BannerProps>(
	(
		{
			variant = 'info',
			appearance = 'filled',
			heading,
			paragraph,
			onClick,
			className,
			leftIcon,
			rightIcon,
			iconProps,
			...props
		},
		ref
	) => {
		// Determine if the banner is interactive
		const isInteractive = !!onClick

		const renderIcon = (
			icon: boolean | React.ReactNode,
			position: 'left' | 'right'
		) => {
			if (!icon) {
				return null
			}

			if (React.isValidElement(icon)) {
				return icon
			}

			if (position === 'left') {
				return (
					<FeatureShineIcon
						height={24}
						width={24}
						color="currentColor"
						{...iconProps}
					/>
				)
			}

			if (position === 'right') {
				return (
					<ArrowRightIcon
						height={16}
						width={16}
						color="currentColor"
						{...iconProps}
					/>
				)
			}

			return null
		}

		return (
			<div
				ref={ref}
				className={cn(
					bannerVariants({ variant, appearance }),
					{ 'cursor-pointer': isInteractive },
					className
				)}
				onClick={onClick}
				role={isInteractive ? 'button' : 'status'}
				aria-live="polite"
				tabIndex={isInteractive ? 0 : undefined}
				{...props}
			>
				{/* Left Icon */}
				{renderIcon(leftIcon, 'left')}

				{/* Content */}
				<div className="flex-1">
					{heading && (
						<h6 className="font-fm-text leading-fm-lg [font-size:var(--text-fm-lg)] font-normal">
							{heading}
						</h6>
					)}

					{paragraph && (
						<p className="font-fm-text leading-fm-sm [font-size:var(--text-fm-sm)]">
							{paragraph}
						</p>
					)}
				</div>

				{/* Right Arrow */}
				{renderIcon(rightIcon, 'right')}

				<div className={borderVariants({ variant, appearance })}></div>
			</div>
		)
	}
)

Banner.displayName = 'Banner'

export default Banner
