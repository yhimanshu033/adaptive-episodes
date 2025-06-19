'use client'

import * as React from 'react'
import * as ToolbarPrimitive from '@radix-ui/react-toolbar'
import { cn, withCn, withRef, withVariants } from '@udecode/cn'
import { cva, type VariantProps } from 'class-variance-authority'

import { Divider } from '@/components/aural-ui/divider'
import { withTooltip } from '@/components/aural-ui/tooltip'
import { Icons } from '@/components/icons'

export const Toolbar = withCn(
	ToolbarPrimitive.Root,
	'relative flex select-none items-center gap-1 bg-background'
)

export const ToolbarToggleGroup = withCn(
	ToolbarPrimitive.ToolbarToggleGroup,
	'flex items-center'
)

export const ToolbarLink = withCn(
	ToolbarPrimitive.Link,
	'font-medium underline underline-offset-4'
)

export const ToolbarSeparator = withCn(
	ToolbarPrimitive.Separator,
	'my-1 w-px shrink-0 bg-border'
)

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

const ToolbarButton = withTooltip(
	// eslint-disable-next-line react/display-name
	React.forwardRef<
		React.ElementRef<typeof ToolbarToggleItem>,
		{
			isDropdown?: boolean
			pressed?: boolean
		} & Omit<
			React.ComponentPropsWithoutRef<typeof ToolbarToggleItem>,
			'asChild' | 'value'
		> &
			VariantProps<typeof toolbarButtonVariants>
	>(
		(
			{ children, className, isDropdown, pressed, size, variant, ...props },
			ref
		) => {
			return typeof pressed === 'boolean' ? (
				<ToolbarToggleGroup
					disabled={props.disabled}
					value="single"
					type="single"
				>
					<ToolbarToggleItem
						ref={ref}
						className={cn(
							toolbarButtonVariants({
								size,
								variant,
							}),
							isDropdown && 'justify-between pr-1',
							className
						)}
						value={pressed ? 'single' : ''}
						{...props}
					>
						{isDropdown ? (
							<>
								<div className="flex flex-1">{children}</div>
								<div>
									<Icons.arrowDown className="ml-0.5 size-4" data-icon />
								</div>
							</>
						) : (
							children
						)}
					</ToolbarToggleItem>
				</ToolbarToggleGroup>
			) : (
				<ToolbarPrimitive.Button
					ref={ref}
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
		}
	)
)
ToolbarButton.displayName = 'ToolbarButton'

export { ToolbarButton }

export const ToolbarToggleItem = withVariants(
	ToolbarPrimitive.ToggleItem,
	toolbarButtonVariants,
	['variant', 'size']
)

export const ToolbarGroup = withRef<
	'div',
	{
		noSeparator?: boolean
		seperatorProps?: React.ComponentProps<typeof Divider>
	}
>(({ children, className, noSeparator, seperatorProps }, ref) => {
	const childArr = React.Children.map(children, (c) => c)

	if (!childArr || childArr.length === 0) {
		return null
	}

	return (
		<div ref={ref} className={cn('flex', className)}>
			{!noSeparator && (
				<Divider
					orientation="vertical"
					variant="secondary"
					{...seperatorProps}
				/>
			)}

			<div className="toolbar-group-content mx-1 flex items-center gap-1">
				{children}
			</div>
		</div>
	)
})
