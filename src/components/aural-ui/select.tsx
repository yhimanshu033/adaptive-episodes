import * as React from 'react'
import { ChevronDownIcon } from '@/icons/chevron-down-icon'
import { ChevronUpIcon } from '@/icons/chevron-up-icon'
import { TickIcon } from '@/icons/tick-icon'
import * as SelectPrimitive from '@radix-ui/react-select'
import { cva } from 'class-variance-authority'

import { cn } from '@/lib/aural-ui/utils'

import { Divider } from './divider'
import HelperText from './helper-text'
import Label from './label'

// CVA for select variants matching input component
export const selectVariants = cva(
	// Base styles
	'flex w-full items-center justify-between focus:outline-none transition-all duration-200 border-solid tracking-wide font-fm-text text-fm-primary [&>span]:line-clamp-1 data-[placeholder]:text-fm-placeholder',
	{
		variants: {
			variant: {
				default:
					'border-fm-divider-primary focus:border-fm-divider-contrast data-[state=open]:border-fm-divider-contrast',
				error:
					'border-fm-divider-negative focus:border-fm-divider-negative data-[state=open]:border-fm-divider-negative',
				warning:
					'border-fm-divider-warning focus:border-fm-divider-warning data-[state=open]:border-fm-divider-warning',
				success:
					'border-fm-divider-positive focus:border-fm-divider-positive data-[state=open]:border-fm-divider-positive',
			},
			decoration: {
				underline:
					'border-b h-11 leading-fm-xl [font-size:var(--text-fm-xl)] px-0',
				outline:
					'border rounded-fm-s h-12 leading-fm-md [font-size:var(--text-fm-md)] px-4 py-2',
				filled:
					'h-10 rounded-fm-s bg-fm-surface-frosted/20 border leading-fm-md [font-size:var(--text-fm-md)] px-4 py-2',
			},
			state: {
				default: '',
				open: '',
				disabled:
					'border-fm-divider-tertiary !text-fm-inactive cursor-not-allowed',
			},
		},
		defaultVariants: {
			variant: 'default',
			state: 'default',
			decoration: 'underline',
		},
	}
)

const Select = SelectPrimitive.Root

const SelectGroup = SelectPrimitive.Group

const SelectValue = SelectPrimitive.Value

const SelectTrigger = React.forwardRef<
	React.ElementRef<typeof SelectPrimitive.Trigger>,
	React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger> & {
		classes?: {
			icon?: string
			root?: string
		}
		decoration?: 'underline' | 'outline' | 'filled'
		unstyled?: boolean
		variant?: 'default' | 'error' | 'warning' | 'success'
	}
>(
	(
		{
			className,
			children,
			variant = 'default',
			decoration = 'underline',
			unstyled = false,
			classes = {},
			...props
		},
		ref
	) => (
		<SelectPrimitive.Trigger
			ref={ref}
			className={cn(
				!unstyled &&
					selectVariants({
						variant,
						decoration,
						state: props.disabled ? 'disabled' : 'default',
					}),
				// Add group class to enable group-based selectors
				'group',
				className,
				classes?.root
			)}
			{...props}
		>
			{children}
			<SelectPrimitive.Icon asChild>
				<ChevronDownIcon
					className={cn(
						'h-6 w-6 transition-transform duration-200 group-data-[state=open]:-rotate-180',
						{
							'text-fm-icon-inactive': props.disabled,
							'text-fm-icon-active': !props.disabled,
						},
						classes?.icon
					)}
				/>
			</SelectPrimitive.Icon>
		</SelectPrimitive.Trigger>
	)
)
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName

type SelectScrollButtonProps = React.ComponentPropsWithoutRef<
	typeof SelectPrimitive.ScrollDownButton
> & {
	classes?: {
		icon?: string
		root?: string
	}
}

const SelectScrollUpButton = React.forwardRef<
	React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
	SelectScrollButtonProps
>(({ className, classes = {}, ...props }, ref) => (
	<SelectPrimitive.ScrollUpButton
		ref={ref}
		className={cn(
			'text-fm-primary hover:bg-fm-surface-frosted/10 flex cursor-default items-center justify-center py-1',
			className,
			classes?.root
		)}
		{...props}
	>
		<ChevronUpIcon className={cn('h-6 w-6', classes?.icon)} />
	</SelectPrimitive.ScrollUpButton>
))
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName

const SelectScrollDownButton = React.forwardRef<
	React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
	SelectScrollButtonProps
>(({ className, classes = {}, ...props }, ref) => (
	<SelectPrimitive.ScrollDownButton
		ref={ref}
		className={cn(
			'text-fm-primary hover:bg-fm-surface-frosted/10 flex cursor-default items-center justify-center py-1',
			className,
			classes?.root
		)}
		{...props}
	>
		<ChevronDownIcon className={cn('h-6 w-6', classes?.icon)} />
	</SelectPrimitive.ScrollDownButton>
))
SelectScrollDownButton.displayName =
	SelectPrimitive.ScrollDownButton.displayName

export const borderVariants = cva(
	'absolute w-full left-0 right-0 top-0 h-0.5 block',
	{
		variants: {
			variant: {
				default: '',
				error: '',
				warning: '',
				success: '',
			},
		},
		compoundVariants: [
			// Outlined variants
			{
				variant: 'success',
				className: 'bg-(image:--gradient-fm-stroke-positive)',
			},
			{
				variant: 'error',
				className: 'bg-(image:--gradient-fm-stroke-negative)',
			},
			{
				variant: 'warning',
				className: 'bg-(image:--gradient-fm-stroke-warning)',
			},
			{
				variant: 'default',
				className: 'bg-(image:--gradient-fm-stroke-neutral)',
			},
		],
		defaultVariants: {
			variant: 'default',
		},
	}
)

type SelectContentProps = React.ComponentPropsWithoutRef<
	typeof SelectPrimitive.Content
> & {
	classes?: {
		border?: string
		root?: string
		scrollButton?: {
			icon?: string
			root?: string
		}
		viewport?: string
	}
	variant?: 'default' | 'error' | 'warning' | 'success'
}

const SelectContent = React.forwardRef<
	React.ElementRef<typeof SelectPrimitive.Content>,
	SelectContentProps
>(
	(
		{
			className,
			children,
			position = 'popper',
			variant = 'default',
			classes = {},
			...props
		},
		ref
	) => (
		<SelectPrimitive.Portal>
			<SelectPrimitive.Content
				ref={ref}
				className={cn(
					'bg-fm-surface-frosted/20 relative max-h-96 backdrop-blur-lg',
					position === 'popper' &&
						'data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1',
					className,
					classes?.root
				)}
				position={position}
				{...props}
			>
				<div className={cn(borderVariants({ variant }), classes?.border)} />
				<SelectScrollUpButton classes={classes?.scrollButton} />
				<SelectPrimitive.Viewport
					className={cn(
						position === 'popper' &&
							'h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]',
						classes?.viewport
					)}
				>
					{children}
				</SelectPrimitive.Viewport>
				<SelectScrollDownButton classes={classes?.scrollButton} />
			</SelectPrimitive.Content>
		</SelectPrimitive.Portal>
	)
)
SelectContent.displayName = SelectPrimitive.Content.displayName

const SelectLabel = React.forwardRef<
	React.ElementRef<typeof SelectPrimitive.Label>,
	React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label> & {
		disabled?: boolean
		required?: boolean
	}
>(({ className, required = false, disabled = false, ...props }, ref) => (
	<SelectPrimitive.Label ref={ref} asChild className={className} {...props}>
		<Label required={required} disabled={disabled}>
			{props.children}
		</Label>
	</SelectPrimitive.Label>
))
SelectLabel.displayName = SelectPrimitive.Label.displayName

type SelectItemProps = React.ComponentPropsWithoutRef<
	typeof SelectPrimitive.Item
> & {
	classes?: {
		icon?: string
		root?: string
	}
}

const SelectItem = React.forwardRef<
	React.ElementRef<typeof SelectPrimitive.Item>,
	SelectItemProps
>(({ className, children, classes = {}, ...props }, ref) => (
	<SelectPrimitive.Item
		ref={ref}
		className={cn(
			'leading-fm-lg font-fm-text data-[disabled]:bg-fm-surface-frosted/30 hover:bg-fm-surface-frosted/20 text-fm-primary data-[state=checked]:not-data-[disabled]:bg-fm-surface-frosted/10 focus-visible:bg-fm-surface-frosted/20 group data-[disabled]:text-fm-inactive relative flex h-12 items-center justify-between gap-2 px-4 [font-size:var(--text-fm-lg)] tracking-wide outline-none data-[disabled]:pointer-events-none',
			className,
			classes?.root
		)}
		{...props}
	>
		<span className="absolute right-4 flex h-3.5 w-3.5 items-center justify-center">
			<SelectPrimitive.ItemIndicator>
				<TickIcon
					className={cn(
						'text-fm-icon-active group-data-[disabled]:text-fm-icon-inactive h-6 w-6',
						classes?.icon
					)}
				/>
			</SelectPrimitive.ItemIndicator>
		</span>

		<SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
	</SelectPrimitive.Item>
))
SelectItem.displayName = SelectPrimitive.Item.displayName

const SelectSeparator = React.forwardRef<
	React.ElementRef<typeof SelectPrimitive.Separator>,
	React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator> &
		React.ComponentPropsWithoutRef<typeof Divider>
>(({ className, ...props }, ref) => (
	<SelectPrimitive.Separator ref={ref} className={className} {...props} asChild>
		<Divider variant="dashed" size="full_default" />
	</SelectPrimitive.Separator>
))
SelectSeparator.displayName = SelectPrimitive.Separator.displayName

const SelectHelperText = React.forwardRef<
	HTMLSpanElement,
	React.ComponentProps<typeof HelperText> & {
		variant?: 'default' | 'error' | 'warning' | 'success'
	}
>((props, ref) => {
	const { variant = 'default', children, ...rest } = props
	return (
		<HelperText variant={variant} ref={ref} {...rest}>
			{children}
		</HelperText>
	)
})
SelectHelperText.displayName = HelperText.displayName

// Compound Select component with label and helper text
export interface SelectFieldProps {
	'aria-describedby'?: string
	'aria-label'?: string
	'aria-labelledby'?: string
	children?: React.ReactNode
	className?: string
	classes?: {
		content?: {
			border?: string
			root?: string
			scrollButton?: {
				icon?: string
				root?: string
			}
			viewport?: string
		}
		helperText?: string
		label?: string
		root?: string
		trigger?: {
			icon?: string
			root?: string
		}
		wrapper?: string
	}
	decoration?: 'underline' | 'outline' | 'filled'
	disabled?: boolean
	fullWidth?: boolean
	helperText?: React.ReactNode
	id?: string
	label?: React.ReactNode
	name?: string
	onValueChange?: (value: string) => void
	placeholder?: string
	required?: boolean
	value?: string
	variant?: 'default' | 'error' | 'warning' | 'success'
}

const SelectRoot = React.forwardRef<
	HTMLDivElement,
	React.PropsWithChildren<{ className?: string; fullWidth?: boolean }>
>(({ children, className = '', fullWidth = false }, ref) => (
	<SelectGroup
		ref={ref}
		className={cn(
			'space-y-1',
			{
				'w-full': fullWidth,
			},
			className
		)}
	>
		{children}
	</SelectGroup>
))
SelectRoot.displayName = 'SelectRoot'

const SelectWrapper = React.forwardRef<
	HTMLDivElement,
	React.PropsWithChildren<{ className?: string }>
>(({ children, className = '' }, ref) => (
	<div ref={ref} className={cn('relative', className)}>
		{children}
	</div>
))
SelectWrapper.displayName = 'SelectWrapper'

const SelectField = React.forwardRef<
	React.ElementRef<typeof SelectTrigger>,
	SelectFieldProps
>(
	(
		{
			label,
			helperText,
			variant = 'default',
			decoration = 'underline',
			required = false,
			disabled = false,
			fullWidth = false,
			className = '',
			children,
			value,
			onValueChange,
			placeholder,
			id,
			name,
			classes,
			'aria-label': ariaLabel,
			'aria-describedby': ariaDescribedBy,
			'aria-labelledby': ariaLabelledBy,
			...props
		},
		ref
	) => {
		// Generate unique IDs for accessibility
		const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`
		const helperTextId = helperText ? `${selectId}-helper` : undefined
		const labelId = label ? `${selectId}-label` : undefined

		// Build aria-describedby
		const describedByIds = [ariaDescribedBy, helperTextId]
			.filter(Boolean)
			.join(' ')

		// Build aria-labelledby
		const labelledByIds = [ariaLabelledBy, labelId].filter(Boolean).join(' ')

		return (
			<SelectRoot
				fullWidth={fullWidth}
				className={cn(className, classes?.root)}
			>
				{/* Label */}
				{label && (
					<SelectLabel
						id={labelId}
						required={required}
						disabled={disabled}
						className={classes?.label}
					>
						{label}
					</SelectLabel>
				)}

				{/* Select wrapper */}
				<SelectWrapper className={classes?.wrapper}>
					<Select
						value={value}
						onValueChange={onValueChange}
						disabled={disabled}
						required={required}
						name={name}
						{...props}
					>
						<SelectTrigger
							ref={ref}
							id={selectId}
							variant={variant}
							decoration={decoration}
							disabled={disabled}
							className={className}
							aria-label={ariaLabel}
							aria-describedby={describedByIds || undefined}
							aria-labelledby={labelledByIds || undefined}
							aria-required={required}
							aria-invalid={variant === 'error'}
							classes={classes?.trigger}
						>
							<SelectValue placeholder={placeholder} />
						</SelectTrigger>

						<SelectContent variant={variant} classes={classes?.content}>
							{children}
						</SelectContent>
					</Select>
				</SelectWrapper>

				{/* Helper text */}
				{helperText && (
					<SelectHelperText
						variant={variant}
						id={helperTextId}
						disabled={disabled}
						className={classes?.helperText}
					>
						{helperText}
					</SelectHelperText>
				)}
			</SelectRoot>
		)
	}
)
SelectField.displayName = 'SelectField'

export {
	Select,
	SelectGroup,
	SelectValue,
	SelectTrigger,
	SelectContent,
	SelectLabel,
	SelectItem,
	SelectSeparator,
	SelectScrollUpButton,
	SelectScrollDownButton,
	SelectHelperText,
	SelectField,
	SelectRoot,
	SelectWrapper,
}

export type { SelectTrigger as SelectTriggerType }
