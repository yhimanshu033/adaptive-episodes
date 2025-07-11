'use client'

import * as React from 'react'
import * as ToolbarPrimitive from '@radix-ui/react-toolbar'
import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import { cva, type VariantProps } from 'class-variance-authority'
import { ChevronDown } from 'lucide-react'

import { Divider } from '@/components/aural-ui/divider'
import {
	DropdownMenuLabel,
	DropdownMenuRadioGroup,
	DropdownMenuSeparator,
} from '@/components/aural-ui/dropdown'
import { cn } from '@/lib/utils/helpers'

import { withTooltip } from '../aural-ui/tooltip'

export function Toolbar({
	className,
	...props
}: React.ComponentProps<typeof ToolbarPrimitive.Root>) {
	return (
		<ToolbarPrimitive.Root
			className={cn('relative flex items-center select-none', className)}
			{...props}
		/>
	)
}

export function ToolbarToggleGroup({
	className,
	...props
}: React.ComponentProps<typeof ToolbarPrimitive.ToolbarToggleGroup>) {
	return (
		<ToolbarPrimitive.ToolbarToggleGroup
			className={cn('flex items-center', className)}
			{...props}
		/>
	)
}

export function ToolbarLink({
	className,
	...props
}: React.ComponentProps<typeof ToolbarPrimitive.Link>) {
	return (
		<ToolbarPrimitive.Link
			className={cn('font-medium underline underline-offset-4', className)}
			{...props}
		/>
	)
}

export function ToolbarSeparator({
	className,
	...props
}: React.ComponentProps<typeof ToolbarPrimitive.Separator>) {
	return (
		<ToolbarPrimitive.Separator
			className={cn('bg-border mx-2 my-1 w-px shrink-0', className)}
			{...props}
		/>
	)
}

// From toggleVariants
const toolbarButtonVariants = cva(
	cn(
		'inline-flex items-center justify-center transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-fm-primary focus-visible:ring-offset-fm-neutral-0 text-fm-icon-active disabled:text-fm-icon-inactive [font-size:var(--text-fm-md)]',
		'[&_svg:not([data-icon])]:size-5',
		'data-[state=open]:bg-fm-secondary-50 data-[state=open]:text-fm-secondary-800',
		'aria-checked:bg-fm-secondary-50 aria-checked:text-fm-secondary-800'
	),
	{
		defaultVariants: {
			size: 'sm',
			variant: 'default',
		},
		variants: {
			size: {
				default: 'h-10 p-3',
				lg: 'h-11 p-5',
				sm: 'h-9 p-2',
				floating: 'p-3 h-full',
			},
			variant: {
				default:
					'bg-transparent hover:text-fm-secondary-800 hover:bg-fm-secondary-50 disabled:bg-transparent',
				outline:
					'border border-solid border-fm-divider-primary hover:border-fm-surface-frosted disabled:border-fm-divider-tertiary',
				active: 'bg-fm-secondary-50 text-fm-secondary-800',
			},
		},
	}
)

const dropdownArrowVariants = cva(
	cn(
		'inline-flex items-center justify-center rounded-r-md text-sm font-medium text-foreground transition-colors disabled:pointer-events-none disabled:opacity-50'
	),
	{
		defaultVariants: {
			size: 'sm',
			variant: 'default',
		},
		variants: {
			size: {
				default: 'h-9 w-6',
				lg: 'h-10 w-8',
				sm: 'h-8 w-4',
			},
			variant: {
				default:
					'bg-transparent hover:bg-muted hover:text-muted-foreground aria-checked:bg-accent aria-checked:text-accent-foreground',
				outline:
					'border border-l-0 border-input bg-transparent hover:bg-accent hover:text-accent-foreground',
			},
		},
	}
)

type ToolbarButtonProps = {
	isDropdown?: boolean
	pressed?: boolean
} & Omit<
	React.ComponentPropsWithoutRef<typeof ToolbarToggleItem>,
	'asChild' | 'value'
> &
	VariantProps<typeof toolbarButtonVariants>

export const ToolbarButton = withTooltip(function ToolbarButton({
	children,
	className,
	isDropdown,
	pressed,
	size = 'sm',
	variant,
	...props
}: ToolbarButtonProps) {
	return typeof pressed === 'boolean' ? (
		<ToolbarToggleGroup disabled={props.disabled} value="single" type="single">
			<ToolbarToggleItem
				className={cn(
					toolbarButtonVariants({
						size,
						variant,
					}),
					isDropdown && 'justify-between gap-1 pr-1',
					className
				)}
				value={pressed ? 'single' : ''}
				{...props}
			>
				{isDropdown ? (
					<>
						<div className="flex flex-1 items-center gap-2 whitespace-nowrap">
							{children}
						</div>
						<div>
							<ChevronDown
								className="text-muted-foreground size-3.5"
								data-icon
							/>
						</div>
					</>
				) : (
					children
				)}
			</ToolbarToggleItem>
		</ToolbarToggleGroup>
	) : (
		<ToolbarPrimitive.Button
			className={cn(
				toolbarButtonVariants({
					size,
					variant,
				}),
				isDropdown && 'pr-1',
				className
			)}
			{...props}
		>
			{children}
		</ToolbarPrimitive.Button>
	)
})

export function ToolbarSplitButton({
	className,
	...props
}: React.ComponentPropsWithoutRef<typeof ToolbarButton>) {
	return (
		<ToolbarButton
			className={cn('group flex gap-0 px-0 hover:bg-transparent', className)}
			{...props}
		/>
	)
}

type ToolbarSplitButtonPrimaryProps = Omit<
	React.ComponentPropsWithoutRef<typeof ToolbarToggleItem>,
	'value'
> &
	VariantProps<typeof toolbarButtonVariants>

export function ToolbarSplitButtonPrimary({
	children,
	className,
	size = 'sm',
	variant,
	...props
}: ToolbarSplitButtonPrimaryProps) {
	return (
		<span
			className={cn(
				toolbarButtonVariants({
					size,
					variant,
				}),
				'rounded-r-none',
				'group-data-[pressed=true]:bg-accent group-data-[pressed=true]:text-accent-foreground',
				className
			)}
			{...props}
		>
			{children}
		</span>
	)
}

export function ToolbarSplitButtonSecondary({
	className,
	size,
	variant,
	...props
}: React.ComponentPropsWithoutRef<'span'> &
	VariantProps<typeof dropdownArrowVariants>) {
	return (
		<span
			className={cn(
				dropdownArrowVariants({
					size,
					variant,
				}),
				'group-data-[pressed=true]:bg-accent group-data-[pressed=true]:text-accent-foreground',
				className
			)}
			onClick={(e) => e.stopPropagation()}
			role="button"
			{...props}
		>
			<ChevronDown className="text-muted-foreground size-3.5" data-icon />
		</span>
	)
}

export function ToolbarToggleItem({
	className,
	size = 'sm',
	variant,
	...props
}: React.ComponentProps<typeof ToolbarPrimitive.ToggleItem> &
	VariantProps<typeof toolbarButtonVariants>) {
	return (
		<ToolbarPrimitive.ToggleItem
			className={cn(toolbarButtonVariants({ size, variant }), className)}
			{...props}
		/>
	)
}

export function ToolbarGroup({
	children,
	className,
	noSeparator,
	seperatorProps,
}: React.ComponentProps<'div'> & {
	noSeparator?: boolean
	seperatorProps?: React.ComponentProps<typeof Divider>
}) {
	return (
		<div className={cn('group/toolbar-group', 'relative flex', className)}>
			{!noSeparator && (
				<Divider
					orientation="vertical"
					variant="secondary"
					{...seperatorProps}
				/>
			)}
			<div className="mx-1 flex items-center gap-1">{children}</div>
		</div>
	)
}

export function TooltipContent({
	children,
	className,
	// CHANGE
	sideOffset = 4,
	...props
}: React.ComponentProps<typeof TooltipPrimitive.Content>) {
	return (
		<TooltipPrimitive.Portal>
			<TooltipPrimitive.Content
				className={cn(
					'bg-primary text-primary-foreground z-50 w-fit origin-(--radix-tooltip-content-transform-origin) rounded-md px-3 py-1.5 text-xs text-balance',
					className
				)}
				data-slot="tooltip-content"
				sideOffset={sideOffset}
				{...props}
			>
				{children}
				{/* CHANGE */}
				{/* <TooltipPrimitive.Arrow className="z-50 size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px] bg-primary fill-primary" /> */}
			</TooltipPrimitive.Content>
		</TooltipPrimitive.Portal>
	)
}

export function ToolbarMenuGroup({
	children,
	className,
	label,
	...props
}: React.ComponentProps<typeof DropdownMenuRadioGroup> & { label?: string }) {
	return (
		<>
			<DropdownMenuSeparator
				className={cn(
					'hidden',
					'mb-0 shrink-0 peer-has-[[role=menuitem]]/menu-group:block peer-has-[[role=menuitemradio]]/menu-group:block peer-has-[[role=option]]/menu-group:block'
				)}
			/>

			<DropdownMenuRadioGroup
				{...props}
				className={cn(
					'hidden',
					'peer/menu-group group/menu-group my-1.5 has-[[role=menuitem]]:block has-[[role=menuitemradio]]:block has-[[role=option]]:block',
					className
				)}
			>
				{label && (
					<DropdownMenuLabel className="px-0">{label}</DropdownMenuLabel>
				)}
				{children}
			</DropdownMenuRadioGroup>
		</>
	)
}
