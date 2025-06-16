import React, { forwardRef } from 'react'
import { cva, VariantProps } from 'class-variance-authority'

import { cn } from '../../lib/aural-ui/utils'

export const typographyVariants = cva('', {
	variants: {
		variant: {
			'display-large': 'text-fm-8xl leading-fm-8xl font-fm-brand',
			'display-medium': 'text-fm-7xl leading-fm-7xl font-fm-brand',
			'display-small': 'text-fm-6xl leading-fm-6xl font-fm-brand',

			'title-large': 'text-fm-5xl leading-fm-5xl font-fm-brand',
			'title-medium': 'text-fm-4xl leading-fm-4xl font-fm-brand',
			'title-small': 'text-fm-3xl leading-fm-3xl font-fm-brand',

			'label-large': 'text-fm-2xl leading-fm-2xl font-fm-brand',
			'label-medium': 'text-fm-xl leading-fm-xl font-fm-brand',
			'label-small': 'text-fm-lg leading-fm-lg font-fm-brand',

			'body-large': 'text-fm-xl leading-fm-xl font-fm-text',
			'body-medium': 'text-fm-lg leading-fm-lg font-fm-text',
			'body-small': 'text-fm-md leading-fm-md font-fm-text',

			'caption-large': 'text-fm-md leading-fm-md font-fm-text',
			'caption-medium': 'text-fm-sm leading-fm-sm font-fm-text',
			'caption-small': 'text-fm-xs leading-fm-xs font-fm-text',
		},
		weight: {
			regular: 'font-normal',
			medium: 'font-medium',
			semibold: 'font-semibold',
			bold: 'font-bold',
		},
		align: {
			left: 'text-left',
			center: 'text-center',
			right: 'text-right',
		},
		color: {
			primary: '[color:var(--color-fm-primary)]',
			secondary: '[color:var(--color-fm-secondary)]',
			tertiary: '[color:var(--color-fm-tertiary)]',
			contrast: '[color:var(--color-fm-contrast)]',
			inactive: '[color:var(--color-fm-inactive)]',
		},
		transform: {
			uppercase: 'uppercase',
			lowercase: 'lowercase',
			capitalize: 'capitalize',
			normal: '',
		},
		lineHeight: {
			tight: 'leading-tight',
			normal: 'leading-normal',
			loose: 'leading-loose',
			auto: '',
		},
		wrap: {
			normal: '',
			nowrap: '[text-wrap:nowrap]',
			wrap: '[text-wrap:wrap]',
			pretty: '[text-wrap:pretty]',
			balance: '[text-wrap:balance]',
		},
	},
	defaultVariants: {
		variant: 'body-medium',
		weight: 'regular',
		align: 'left',
		color: 'primary',
		transform: 'normal',
		lineHeight: 'auto',
		wrap: 'normal',
	},
})

export interface TypographyProps
	extends Omit<React.HTMLAttributes<HTMLElement>, 'color'>,
		VariantProps<typeof typographyVariants> {
	as?: React.ElementType
	children: React.ReactNode
	className?: string
}

export const Typography = forwardRef<HTMLElement, TypographyProps>(
	(
		{
			as: Element = 'p',
			children,
			className,
			variant,
			weight,
			align,
			color,
			transform,
			lineHeight,
			wrap,
			...props
		},
		ref
	) => {
		return (
			<Element
				ref={ref}
				className={cn(
					typographyVariants({
						variant,
						weight,
						align,
						color,
						transform,
						lineHeight,
						wrap,
					}),
					className
				)}
				{...props}
			>
				{children}
			</Element>
		)
	}
)

Typography.displayName = 'Typography'

// Export specific variants for easier use
export const DisplayLarge = (props: Omit<TypographyProps, 'variant'>) => (
	<Typography variant="display-large" as="h1" {...props} />
)

export const DisplayMedium = (props: Omit<TypographyProps, 'variant'>) => (
	<Typography variant="display-medium" as="h1" {...props} />
)

export const DisplaySmall = (props: Omit<TypographyProps, 'variant'>) => (
	<Typography variant="display-small" as="h1" {...props} />
)

export const TitleLarge = (props: Omit<TypographyProps, 'variant'>) => (
	<Typography variant="title-large" as="h2" {...props} />
)

export const TitleMedium = (props: Omit<TypographyProps, 'variant'>) => (
	<Typography variant="title-medium" as="h3" {...props} />
)

export const TitleSmall = (props: Omit<TypographyProps, 'variant'>) => (
	<Typography variant="title-small" as="h4" {...props} />
)

export const LabelLarge = (props: Omit<TypographyProps, 'variant'>) => (
	<Typography variant="label-large" as="span" {...props} />
)

export const LabelMedium = (props: Omit<TypographyProps, 'variant'>) => (
	<Typography variant="label-medium" as="span" {...props} />
)

export const LabelSmall = (props: Omit<TypographyProps, 'variant'>) => (
	<Typography variant="label-small" as="span" {...props} />
)

export const BodyLarge = (props: Omit<TypographyProps, 'variant'>) => (
	<Typography variant="body-large" {...props} />
)

export const BodyMedium = (props: Omit<TypographyProps, 'variant'>) => (
	<Typography variant="body-medium" {...props} />
)

export const BodySmall = (props: Omit<TypographyProps, 'variant'>) => (
	<Typography variant="body-small" {...props} />
)

export const CaptionLarge = (props: Omit<TypographyProps, 'variant'>) => (
	<Typography variant="caption-large" as="span" {...props} />
)

export const CaptionMedium = (props: Omit<TypographyProps, 'variant'>) => (
	<Typography variant="caption-medium" as="span" {...props} />
)

export const CaptionSmall = (props: Omit<TypographyProps, 'variant'>) => (
	<Typography variant="caption-small" as="span" {...props} />
)
