import * as React from 'react'
import * as SheetPrimitive from '@radix-ui/react-dialog'
import { cva, type VariantProps } from 'class-variance-authority'

import { CrossIcon } from '../../icons/cross-icon'
import { cn } from '../../lib/aural-ui/utils'
import { Overlay } from './overlay'

const Sheet = SheetPrimitive.Root

const SheetTrigger = SheetPrimitive.Trigger

const SheetClose = SheetPrimitive.Close

const SheetPortal = SheetPrimitive.Portal

export interface ISheetOverlay {
	classes?: {
		border?: string
		close?: string
		closeIcon?: string
		content?: string
		overlay?: string
		root?: string
	}
	glass?: 'high' | 'medium' | 'low' | 'none'
	noise?: 'high' | 'medium' | 'low' | 'none'
	opacity?: 'high' | 'medium' | 'low' | 'none'
}

const SheetOverlay = React.forwardRef<
	React.ElementRef<typeof SheetPrimitive.Overlay>,
	React.ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay> & ISheetOverlay
>(({ opacity, glass, ...props }, ref) => (
	<SheetPrimitive.Overlay ref={ref} asChild {...props}>
		<Overlay opacity={opacity} glass={glass} />
	</SheetPrimitive.Overlay>
))

SheetOverlay.displayName = SheetPrimitive.Overlay.displayName

export const sheetBorderVariants = cva('absolute block', {
	variants: {
		side: {
			top: 'bottom-0',
			bottom: 'top-0',
			left: 'right-0',
			right: 'left-0',
		},
		variant: {
			neutral: '',
			negative: '',
			warning: '',
			positive: '',
			info: '',
		},
		alignment: {
			horizontal: 'left-0 right-0 h-0.5 w-full',
			vertical: 'top-0 bottom-0 w-0.5 h-full',
		},
	},
	compoundVariants: [
		/** vertical Side */
		{
			alignment: 'vertical',
			variant: 'neutral',
			className: 'bg-(image:--gradient-fm-stroke-neutral-vertical)',
		},
		{
			alignment: 'vertical',
			variant: 'negative',
			className: 'bg-(image:--gradient-fm-stroke-negative-vertical)',
		},
		{
			alignment: 'vertical',
			variant: 'warning',
			className: 'bg-(image:--gradient-fm-stroke-warning-vertical)',
		},
		{
			alignment: 'vertical',
			variant: 'positive',
			className: 'bg-(image:--gradient-fm-stroke-positive-vertical)',
		},
		{
			alignment: 'vertical',
			variant: 'info',
			className: 'bg-(image:--gradient-fm-stroke-info-vertical)',
		},
		/** horizontal Side */
		{
			alignment: 'horizontal',
			variant: 'neutral',
			className: 'bg-(image:--gradient-fm-stroke-neutral)',
		},
		{
			alignment: 'horizontal',
			variant: 'negative',
			className: 'bg-(image:--gradient-fm-stroke-negative)',
		},
		{
			alignment: 'horizontal',
			variant: 'warning',
			className: 'bg-(image:--gradient-fm-stroke-warning)',
		},
		{
			alignment: 'horizontal',
			variant: 'positive',
			className: 'bg-(image:--gradient-fm-stroke-positive)',
		},
		{
			alignment: 'horizontal',
			variant: 'info',
			className: 'bg-(image:--gradient-fm-stroke-info)',
		},
	],
	defaultVariants: {
		side: 'bottom',
		variant: 'neutral',
	},
})

const sheetWrapperVariants = cva('fixed z-50 transition flex gap-4', {
	variants: {
		side: {
			top: 'inset-x-0 top-0 data-[state=closed]:animate-fm-slideOutUp data-[state=open]:animate-fm-slideInDown flex-col items-center justify-center',
			bottom:
				'inset-x-0 bottom-0 data-[state=closed]:animate-fm-slideOutDown data-[state=open]:animate-fm-slideInUp flex-col-reverse items-center justify-center',
			left: 'inset-y-0 left-0 h-full data-[state=closed]:animate-fm-slideOutLeft data-[state=open]:animate-fm-slideInLeft flex-row items-start justify-start',
			right:
				'inset-y-0 right-0 h-full data-[state=closed]:animate-fm-slideOutRight data-[state=open]:animate-fm-slideInRight flex-row-reverse items-start justify-start',
		},
	},
	defaultVariants: {
		side: 'bottom',
	},
})

const sheetVariants = cva('bg-fm-surface-frosted/20 p-4 backdrop-blur-sm', {
	variants: {
		side: {
			top: 'w-full rounded-b-fm-s',
			bottom: 'w-full rounded-t-fm-s',
			left: 'h-full rounded-r-fm-s w-3/4 sm:w-md',
			right: 'h-full rounded-l-fm-s w-3/4 sm:w-md',
		},
		variant: {
			neutral: '',
			positive: '',
			negative: '',
			warning: '',
			info: '',
		},
	},
	compoundVariants: [
		/** Bottom Side*/
		{
			side: 'bottom',
			variant: 'neutral',
			className:
				'[box-shadow:var(--bottom-sheet-shadow)_var(--color-fm-neutral-300)]',
		},
		{
			side: 'bottom',
			variant: 'positive',
			className:
				'[box-shadow:var(--bottom-sheet-shadow)_var(--color-fm-green-300)]',
		},
		{
			side: 'bottom',
			variant: 'negative',
			className:
				'[box-shadow:var(--bottom-sheet-shadow)_var(--color-fm-red-300)]',
		},
		{
			side: 'bottom',
			variant: 'warning',
			className:
				'[box-shadow:var(--bottom-sheet-shadow)_var(--color-fm-yellow-300)]',
		},
		{
			side: 'bottom',
			variant: 'info',
			className:
				'[box-shadow:var(--bottom-sheet-shadow)_var(--color-fm-blue-300)]',
		},
		/** Top Side*/
		{
			side: 'top',
			variant: 'neutral',
			className:
				'[box-shadow:var(--top-sheet-shadow)_var(--color-fm-neutral-300)]',
		},
		{
			side: 'top',
			variant: 'positive',
			className:
				'[box-shadow:var(--top-sheet-shadow)_var(--color-fm-green-300)]',
		},
		{
			side: 'top',
			variant: 'negative',
			className: '[box-shadow:var(--top-sheet-shadow)_var(--color-fm-red-300)]',
		},
		{
			side: 'top',
			variant: 'warning',
			className:
				'[box-shadow:var(--top-sheet-shadow)_var(--color-fm-yellow-300)]',
		},
		{
			side: 'top',
			variant: 'info',
			className:
				'[box-shadow:var(--top-sheet-shadow)_var(--color-fm-blue-300)]',
		},
		/** Left Side*/
		{
			side: 'left',
			variant: 'neutral',
			className:
				'[box-shadow:var(--left-sheet-shadow)_var(--color-fm-neutral-300)]',
		},
		{
			side: 'left',
			variant: 'positive',
			className:
				'[box-shadow:var(--left-sheet-shadow)_var(--color-fm-green-300)]',
		},
		{
			side: 'left',
			variant: 'negative',
			className:
				'[box-shadow:var(--left-sheet-shadow)_var(--color-fm-red-300)]',
		},
		{
			side: 'left',
			variant: 'warning',
			className:
				'[box-shadow:var(--left-sheet-shadow)_var(--color-fm-yellow-300)]',
		},
		{
			side: 'left',
			variant: 'info',
			className:
				'[box-shadow:var(--left-sheet-shadow)_var(--color-fm-blue-300)]',
		},
		/** Right Side*/
		{
			side: 'right',
			variant: 'neutral',
			className:
				'[box-shadow:var(--right-sheet-shadow)_var(--color-fm-neutral-300)]',
		},
		{
			side: 'right',
			variant: 'positive',
			className:
				'[box-shadow:var(--right-sheet-shadow)_var(--color-fm-green-300)]',
		},
		{
			side: 'right',
			variant: 'negative',
			className:
				'[box-shadow:var(--right-sheet-shadow)_var(--color-fm-red-300)]',
		},
		{
			side: 'right',
			variant: 'warning',
			className:
				'[box-shadow:var(--right-sheet-shadow)_var(--color-fm-yellow-300)]',
		},
		{
			side: 'right',
			variant: 'info',
			className:
				'[box-shadow:var(--right-sheet-shadow)_var(--color-fm-blue-300)]',
		},
	],
	defaultVariants: {
		side: 'bottom',
		variant: 'neutral',
	},
})

const closeIconVariants = cva(
	'bg-fm-button-fill-secondary text-fm-icon-active hover:bg-fm-button-fill-secondary/80 flex cursor-pointer items-center justify-center gap-2 rounded-full p-3 backdrop-blur-sm',
	{
		variants: {
			side: {
				top: '',
				bottom: '',
				left: 'mt-4',
				right: 'mt-4',
			},
		},
		defaultVariants: {
			side: 'bottom',
		},
	}
)

interface SheetContentProps
	extends React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content>,
		VariantProps<typeof sheetVariants>,
		ISheetOverlay {
	container: HTMLElement | null
}

const SheetContent = React.forwardRef<
	React.ElementRef<typeof SheetPrimitive.Content>,
	SheetContentProps
>(
	(
		{
			side = 'bottom',
			variant,
			className,
			opacity,
			glass,
			noise,
			children,
			classes,
			container,
			...props
		},
		ref
	) => (
		<SheetPortal container={container}>
			<SheetOverlay
				opacity={opacity}
				glass={glass}
				noise={noise}
				className={classes?.overlay}
			/>

			<SheetPrimitive.Content
				ref={ref}
				className={cn(sheetWrapperVariants({ side }), classes?.content)}
			>
				<div
					className={cn(
						sheetVariants({ side, variant }),
						className,
						classes?.root
					)}
					{...props}
				>
					<div
						className={cn(
							sheetBorderVariants({
								variant,
								side,
								alignment:
									side === 'left' || side === 'right'
										? 'vertical'
										: 'horizontal',
							}),
							classes?.border
						)}
					/>
					{children}
				</div>
				<SheetPrimitive.Close
					className={cn(closeIconVariants({ side }), classes?.close)}
				>
					<CrossIcon className={cn('h-4 w-4', classes?.closeIcon)} />
					<span className="sr-only">Close</span>
				</SheetPrimitive.Close>
			</SheetPrimitive.Content>
		</SheetPortal>
	)
)
SheetContent.displayName = SheetPrimitive.Content.displayName

const SheetHeader = ({
	className,
	...props
}: React.HTMLAttributes<HTMLDivElement>) => (
	<div
		className={cn(
			'flex flex-col space-y-2 text-center sm:text-left',
			className
		)}
		{...props}
	/>
)
SheetHeader.displayName = 'SheetHeader'

const SheetFooter = ({
	className,
	...props
}: React.HTMLAttributes<HTMLDivElement>) => (
	<div
		className={cn(
			'flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2',
			className
		)}
		{...props}
	/>
)
SheetFooter.displayName = 'SheetFooter'

const SheetTitle = React.forwardRef<
	React.ElementRef<typeof SheetPrimitive.Title>,
	React.ComponentPropsWithoutRef<typeof SheetPrimitive.Title>
>(({ className, ...props }, ref) => (
	<SheetPrimitive.Title
		ref={ref}
		className={cn(
			'text-fm-primary leading-fm-xl [font-size:var(--text-fm-xl)] font-medium',
			className
		)}
		{...props}
	/>
))
SheetTitle.displayName = SheetPrimitive.Title.displayName

const SheetDescription = React.forwardRef<
	React.ElementRef<typeof SheetPrimitive.Description>,
	React.ComponentPropsWithoutRef<typeof SheetPrimitive.Description>
>(({ className, ...props }, ref) => (
	<SheetPrimitive.Description
		ref={ref}
		className={cn(
			'text-fm-primary leading-fm-md [font-size:var(--text-fm-md)]',
			className
		)}
		{...props}
	/>
))
SheetDescription.displayName = SheetPrimitive.Description.displayName

export {
	Sheet,
	SheetPortal,
	SheetOverlay,
	SheetTrigger,
	SheetClose,
	SheetContent,
	SheetHeader,
	SheetFooter,
	SheetTitle,
	SheetDescription,
}
