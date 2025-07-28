import * as React from 'react'
import { ChevronRightIcon } from '@/icons/chevron-right-icon'
import { TickIcon } from '@/icons/tick-icon'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/aural-ui/utils'

import { Divider } from './divider'
import { Label } from './label'

// Base List Container
export const listVariants = cva(
	'bg-fm-surface-frosted/20 relative shadow-lg backdrop-blur-lg',
	{
		variants: {
			variant: {
				default: '',
				elevated: 'shadow-xl',
				flat: 'shadow-sm',
			},
			size: {
				sm: 'min-w-32',
				default: 'min-w-40',
				lg: 'min-w-48',
				xl: 'min-w-56',
			},
			rounded: {
				none: 'rounded-none',
				sm: 'rounded-sm',
				default: 'rounded-fm-s',
				lg: 'rounded-lg',
			},
		},
		defaultVariants: {
			variant: 'default',
			size: 'default',
			rounded: 'default',
		},
	}
)

// Border variants for top accent
export const listBorderVariants = cva(
	'absolute top-0 right-0 left-0 block h-0.5 w-full',
	{
		variants: {
			variant: {
				default: 'bg-(image:--gradient-fm-stroke-neutral)',
				error: 'bg-(image:--gradient-fm-stroke-negative)',
				warning: 'bg-(image:--gradient-fm-stroke-warning)',
				success: 'bg-(image:--gradient-fm-stroke-positive)',
				info: 'bg-(image:--gradient-fm-stroke-info)',
			},
		},
		defaultVariants: {
			variant: 'default',
		},
	}
)

// List Item variants
export const listItemVariants = cva(
	'relative flex cursor-default items-center gap-2 transition-colors duration-200 outline-none select-none',
	{
		variants: {
			variant: {
				default:
					'text-fm-primary hover:bg-fm-surface-frosted/20 focus-visible:bg-fm-surface-frosted/20',
				destructive:
					'text-fm-negative hover:bg-fm-surface-negative/20 focus-visible:bg-fm-surface-negative/20',
			},
			size: {
				sm: 'px-3 py-2 text-sm leading-5',
				default:
					'px-4 py-3 font-fm-text leading-fm-lg [font-size:var(--text-fm-lg)] tracking-wide',
				lg: 'px-4 py-4 text-lg leading-6',
			},
			state: {
				default: '',
				selected: 'bg-fm-surface-frosted/10',
				disabled:
					'text-fm-inactive bg-fm-surface-frosted/30 pointer-events-none',
			},
			rounded: {
				none: 'rounded-none',
				sm: 'rounded-sm',
				default: 'rounded-fm-s',
				lg: 'rounded-lg',
			},
			inset: {
				none: '',
				sm: 'pl-6',
				default: 'pl-8',
				lg: 'pl-10',
			},
		},
		defaultVariants: {
			variant: 'default',
			size: 'default',
			state: 'default',
			rounded: 'default',
			inset: 'none',
		},
	}
)

// List Label variants
export const listLabelVariants = cva(
	'text-fm-label-secondary text-sm font-medium tracking-wide',
	{
		variants: {
			size: {
				sm: 'px-3 py-1.5',
				default: 'px-4 py-2',
				lg: 'px-4 py-3',
			},
			inset: {
				none: '',
				sm: 'pl-6',
				default: 'pl-8',
				lg: 'pl-10',
			},
		},
		defaultVariants: {
			size: 'default',
			inset: 'none',
		},
	}
)

// Base List Container Component
export interface ListProps
	extends React.HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof listVariants> {
	borderVariant?: 'default' | 'error' | 'warning' | 'success' | 'info'
	classes?: {
		border?: string
		root?: string
	}
	showBorder?: boolean
}

const List = React.forwardRef<HTMLDivElement, ListProps>(
	(
		{
			className,
			children,
			variant,
			size,
			rounded,
			borderVariant = 'default',
			showBorder = true,
			classes = {},
			...props
		},
		ref
	) => (
		<div
			ref={ref}
			data-slot="list"
			className={cn(
				listVariants({ variant, size, rounded }),
				className,
				classes?.root
			)}
			role="listbox"
			{...props}
		>
			{showBorder && (
				<div
					className={cn(
						listBorderVariants({ variant: borderVariant }),
						classes?.border
					)}
				/>
			)}
			{children}
		</div>
	)
)
List.displayName = 'List'

// List Group Component
export interface ListGroupProps extends React.HTMLAttributes<HTMLDivElement> {
	classes?: {
		root?: string
	}
}

const ListGroup = React.forwardRef<HTMLDivElement, ListGroupProps>(
	({ className, children, classes = {}, ...props }, ref) => (
		<div
			ref={ref}
			data-slot="list-group"
			className={cn('', className, classes?.root)}
			role="group"
			{...props}
		>
			{children}
		</div>
	)
)
ListGroup.displayName = 'ListGroup'

// List Item Component
export interface ListItemProps
	extends React.HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof listItemVariants> {
	classes?: {
		content?: string
		indicator?: string
		root?: string
		shortcut?: string
	}
	disabled?: boolean
	indicatorIcon?: React.ReactNode
	selected?: boolean
	shortcut?: string
	showIndicator?: boolean
}

const ListItem = React.forwardRef<HTMLDivElement, ListItemProps>(
	(
		{
			className,
			children,
			variant,
			size,
			rounded,
			inset,
			selected = false,
			disabled = false,
			showIndicator = false,
			indicatorIcon,
			shortcut,
			classes = {},
			...props
		},
		ref
	) => {
		const state = disabled ? 'disabled' : selected ? 'selected' : 'default'

		return (
			<div
				ref={ref}
				data-slot="list-item"
				data-selected={selected}
				data-disabled={disabled}
				className={cn(
					listItemVariants({ variant, size, state, rounded, inset }),
					// Icon styling
					"[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
					"[&_svg:not([class*='text-'])]:text-fm-icon-active",
					'data-[variant=destructive]:*:[svg]:!text-fm-negative',
					className,
					classes?.root
				)}
				role="option"
				aria-selected={selected}
				aria-disabled={disabled}
				tabIndex={disabled ? -1 : 0}
				{...props}
			>
				{/* Selection Indicator */}
				{showIndicator && (
					<span
						className={cn(
							'pointer-events-none absolute right-4 flex size-3.5 items-center justify-center',
							classes?.indicator
						)}
					>
						{selected &&
							(indicatorIcon || (
								<TickIcon className="text-fm-icon-active size-4" />
							))}
					</span>
				)}

				{/* Content */}
				<div
					className={cn(
						'flex flex-1 items-center gap-2 truncate',
						showIndicator && 'pr-8',
						classes?.content
					)}
				>
					{children}
				</div>

				{/* Keyboard Shortcut */}
				{shortcut && (
					<span
						className={cn(
							'font-fm-brand ml-auto text-xs tracking-widest opacity-60',
							classes?.shortcut
						)}
					>
						{shortcut}
					</span>
				)}
			</div>
		)
	}
)
ListItem.displayName = 'ListItem'

// List Checkbox Item Component
export interface ListCheckboxItemProps
	extends Omit<ListItemProps, 'showIndicator'> {
	checked?: boolean
	onCheckedChange?: (checked: boolean) => void
}

const ListCheckboxItem = React.forwardRef<
	HTMLDivElement,
	ListCheckboxItemProps
>(
	(
		{
			className,
			children,
			checked = false,
			onCheckedChange,
			disabled = false,
			classes = {},
			...props
		},
		ref
	) => {
		const handleClick = () => {
			if (!disabled && onCheckedChange) {
				onCheckedChange(!checked)
			}
		}

		return (
			<ListItem
				ref={ref}
				data-slot="list-checkbox-item"
				data-state={checked ? 'checked' : 'unchecked'}
				className={cn(
					'cursor-pointer',
					disabled && 'cursor-not-allowed',
					className
				)}
				inset="none"
				selected={checked}
				disabled={disabled}
				showIndicator
				indicatorIcon={
					checked ? (
						<TickIcon
							className={cn('text-fm-icon-active size-4', classes?.indicator)}
						/>
					) : null
				}
				onClick={handleClick}
				role="option"
				aria-checked={checked}
				classes={classes}
				{...props}
			>
				{children}
			</ListItem>
		)
	}
)
ListCheckboxItem.displayName = 'ListCheckboxItem'

// List Radio Group Context
interface ListRadioGroupContextValue {
	onValueChange?: (value: string) => void
	value?: string
}

const ListRadioGroupContext =
	React.createContext<ListRadioGroupContextValue | null>(null)

// List Radio Group Component
export interface ListRadioGroupProps
	extends React.HTMLAttributes<HTMLDivElement> {
	classes?: {
		root?: string
	}
	onValueChange?: (value: string) => void
	value?: string
}

const ListRadioGroup = React.forwardRef<HTMLDivElement, ListRadioGroupProps>(
	(
		{ className, children, value, onValueChange, classes = {}, ...props },
		ref
	) => (
		<ListRadioGroupContext.Provider value={{ value, onValueChange }}>
			<div
				ref={ref}
				data-slot="list-radio-group"
				className={cn('', className, classes?.root)}
				role="radiogroup"
				{...props}
			>
				{children}
			</div>
		</ListRadioGroupContext.Provider>
	)
)
ListRadioGroup.displayName = 'ListRadioGroup'

// List Radio Item Component
export interface ListRadioItemProps
	extends Omit<ListItemProps, 'showIndicator' | 'selected' | 'onSelect'> {
	onSelect?: (value: string) => void
	value: string
}

const ListRadioItem = React.forwardRef<HTMLDivElement, ListRadioItemProps>(
	(
		{
			className,
			children,
			value,
			onSelect,
			disabled = false,
			classes = {},
			...props
		},
		ref
	) => {
		const context = React.useContext(ListRadioGroupContext)

		if (!context) {
			throw new Error('ListRadioItem must be used within a ListRadioGroup')
		}

		const { value: groupValue, onValueChange } = context
		const checked = value === groupValue

		const handleClick = () => {
			if (!disabled) {
				// Call the group's onValueChange first
				onValueChange?.(value)
				// Then call the individual item's onSelect if provided
				onSelect?.(value)
			}
		}

		return (
			<ListItem
				ref={ref}
				data-slot="list-radio-item"
				data-state={checked ? 'checked' : 'unchecked'}
				className={cn(
					'cursor-pointer',
					disabled && 'cursor-not-allowed',
					className
				)}
				inset="none"
				selected={checked}
				disabled={disabled}
				showIndicator
				indicatorIcon={
					checked ? (
						<TickIcon
							className={cn(
								'text-fm-icon-active size-2 fill-current',
								classes?.indicator
							)}
						/>
					) : null
				}
				onClick={handleClick}
				role="radio"
				aria-checked={checked}
				classes={classes}
				{...props}
			>
				{children}
			</ListItem>
		)
	}
)
ListRadioItem.displayName = 'ListRadioItem'

// List Label Component
export interface ListLabelProps
	extends React.HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof listLabelVariants> {
	classes?: {
		root?: string
	}
}

const ListLabel = React.forwardRef<HTMLDivElement, ListLabelProps>(
	({ className, children, size, inset, classes = {}, ...props }, ref) => (
		<div
			ref={ref}
			data-slot="list-label"
			className={cn(
				listLabelVariants({ size, inset }),
				className,
				classes?.root
			)}
			{...props}
		>
			<Label>{children}</Label>
		</div>
	)
)
ListLabel.displayName = 'ListLabel'

// List Separator Component
export interface ListSeparatorProps
	extends React.HTMLAttributes<HTMLDivElement> {
	classes?: {
		root?: string
	}
}

const ListSeparator = React.forwardRef<HTMLDivElement, ListSeparatorProps>(
	({ className, classes = {}, ...props }, ref) => (
		<div
			ref={ref}
			data-slot="list-separator"
			className={cn('my-1', className, classes?.root)}
			role="separator"
			{...props}
		>
			<Divider variant="dashed" size="full_default" />
		</div>
	)
)
ListSeparator.displayName = 'ListSeparator'

// List Sub Trigger Component (for nested menus)
export interface ListSubTriggerProps extends ListItemProps {
	classes?: {
		icon?: string
		root?: string
	}
}

const ListSubTrigger = React.forwardRef<HTMLDivElement, ListSubTriggerProps>(
	({ className, children, classes = {}, ...props }, ref) => (
		<ListItem
			ref={ref}
			data-slot="list-sub-trigger"
			className={cn('justify-between', className)}
			classes={{ ...classes, root: cn(classes?.root) }}
			{...props}
		>
			{children}
			<ChevronRightIcon
				className={cn('text-fm-icon-active ml-auto size-4', classes?.icon)}
			/>
		</ListItem>
	)
)
ListSubTrigger.displayName = 'ListSubTrigger'

// Export all components
export {
	List,
	ListGroup,
	ListItem,
	ListCheckboxItem,
	ListRadioGroup,
	ListRadioItem,
	ListLabel,
	ListSeparator,
	ListSubTrigger,
}
