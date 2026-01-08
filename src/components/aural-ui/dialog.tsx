/* eslint-disable react-hooks/exhaustive-deps */
import * as React from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { cva, VariantProps } from 'class-variance-authority'

import { CrossIcon } from '../../icons/cross-icon'
import { cn } from '../../lib/aural-ui/utils'
import { Overlay } from './overlay'

const Dialog = DialogPrimitive.Root

const DialogTrigger = DialogPrimitive.Trigger

const DialogPortal = DialogPrimitive.Portal

const DialogClose = DialogPrimitive.Close

type BorderSide = 'top' | 'bottom' | 'left' | 'right'
type BorderConfig = BorderSide[] | 'all' | 'none'

interface IDialogOverlay {
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

const DialogOverlay = React.forwardRef<
	React.ElementRef<typeof DialogPrimitive.Overlay>,
	React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay> &
		IDialogOverlay
>(({ opacity, glass, noise, ...props }, ref) => (
	<DialogPrimitive.Overlay ref={ref} asChild {...props}>
		<Overlay opacity={opacity} glass={glass} noise={noise} />
	</DialogPrimitive.Overlay>
))

DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

export const dialogBorderVariants = cva('absolute block', {
	variants: {
		variant: {
			neutral: '',
			negative: '',
			warning: '',
			positive: '',
			info: '',
		},
		side: {
			top: 'w-full left-0 right-0 top-0 h-0.5',
			bottom: 'w-full left-0 right-0 bottom-0 h-0.5',
			left: 'h-full top-0 bottom-0 left-0 w-0.5',
			right: 'h-full top-0 bottom-0 right-0 w-0.5',
		},
	},
	compoundVariants: [
		// Horizontal borders (top/bottom) - use regular gradients
		{
			variant: 'neutral',
			side: 'top',
			class: 'bg-(image:--gradient-fm-stroke-neutral)',
		},
		{
			variant: 'neutral',
			side: 'bottom',
			class: 'bg-(image:--gradient-fm-stroke-neutral)',
		},
		{
			variant: 'negative',
			side: 'top',
			class: 'bg-(image:--gradient-fm-stroke-negative)',
		},
		{
			variant: 'negative',
			side: 'bottom',
			class: 'bg-(image:--gradient-fm-stroke-negative)',
		},
		{
			variant: 'warning',
			side: 'top',
			class: 'bg-(image:--gradient-fm-stroke-warning)',
		},
		{
			variant: 'warning',
			side: 'bottom',
			class: 'bg-(image:--gradient-fm-stroke-warning)',
		},
		{
			variant: 'positive',
			side: 'top',
			class: 'bg-(image:--gradient-fm-stroke-positive)',
		},
		{
			variant: 'positive',
			side: 'bottom',
			class: 'bg-(image:--gradient-fm-stroke-positive)',
		},
		{
			variant: 'info',
			side: 'top',
			class: 'bg-(image:--gradient-fm-stroke-info)',
		},
		{
			variant: 'info',
			side: 'bottom',
			class: 'bg-(image:--gradient-fm-stroke-info)',
		},

		// Vertical borders (left/right) - use vertical gradients
		{
			variant: 'neutral',
			side: 'left',
			class: 'bg-(image:--gradient-fm-stroke-neutral-vertical)',
		},
		{
			variant: 'neutral',
			side: 'right',
			class: 'bg-(image:--gradient-fm-stroke-neutral-vertical)',
		},
		{
			variant: 'negative',
			side: 'left',
			class: 'bg-(image:--gradient-fm-stroke-negative-vertical)',
		},
		{
			variant: 'negative',
			side: 'right',
			class: 'bg-(image:--gradient-fm-stroke-negative-vertical)',
		},
		{
			variant: 'warning',
			side: 'left',
			class: 'bg-(image:--gradient-fm-stroke-warning-vertical)',
		},
		{
			variant: 'warning',
			side: 'right',
			class: 'bg-(image:--gradient-fm-stroke-warning-vertical)',
		},
		{
			variant: 'positive',
			side: 'left',
			class: 'bg-(image:--gradient-fm-stroke-positive-vertical)',
		},
		{
			variant: 'positive',
			side: 'right',
			class: 'bg-(image:--gradient-fm-stroke-positive-vertical)',
		},
		{
			variant: 'info',
			side: 'left',
			class: 'bg-(image:--gradient-fm-stroke-info-vertical)',
		},
		{
			variant: 'info',
			side: 'right',
			class: 'bg-(image:--gradient-fm-stroke-info-vertical)',
		},
	],
	defaultVariants: {
		variant: 'neutral',
		side: 'top',
	},
})

export const dialogVariants = cva(
	'flex flex-col gap-5 rounded-fm-s bg-fm-surface-frosted/20 border-solid border-fm-divider-secondary p-4 backdrop-blur-sm w-full max-w-lg relative',
	{
		variants: {
			variant: {
				neutral:
					'[box-shadow:var(--bottom-sheet-shadow)_var(--color-fm-neutral-300)]',
				positive:
					'[box-shadow:var(--bottom-sheet-shadow)_var(--color-fm-green-300)]',
				negative:
					'[box-shadow:var(--bottom-sheet-shadow)_var(--color-fm-red-300)]',
				warning:
					'[box-shadow:var(--bottom-sheet-shadow)_var(--color-fm-yellow-300)]',
				info: '[box-shadow:var(--bottom-sheet-shadow)_var(--color-fm-blue-300)]',
			},
		},
		defaultVariants: {
			variant: 'neutral',
		},
	}
)

interface DialogContentProps
	extends
		React.HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof dialogVariants> {
	borderConfig?: BorderConfig
	showCloseButton?: boolean
}

const DialogContent = React.forwardRef<
	React.ElementRef<typeof DialogPrimitive.Content>,
	DialogContentProps & IDialogOverlay
>(
	(
		{
			variant,
			className,
			opacity,
			glass,
			noise,
			children,
			classes,
			showCloseButton = true,
			borderConfig = 'top',
			...props
		},
		ref
	) => {
		const borderSides = React.useMemo<BorderSide[]>(() => {
			if (borderConfig === 'none') {
				return []
			}
			if (borderConfig === 'all') {
				return ['top', 'bottom', 'left', 'right']
			}
			if (Array.isArray(borderConfig)) {
				return borderConfig
			}
			// Only include borderConfig if it's a valid BorderSide
			const validSides: BorderSide[] = ['top', 'bottom', 'left', 'right']
			return validSides.includes(borderConfig as BorderSide)
				? [borderConfig as BorderSide]
				: []
		}, [borderConfig])

		return (
			<DialogPortal>
				<DialogOverlay
					opacity={opacity}
					glass={glass}
					noise={noise}
					className={classes?.overlay}
				/>
				<DialogPrimitive.Content
					ref={ref}
					className={cn(
						'data-[state=open]:animate-fm-zoomIn data-[state=closed]:animate-fm-zoomOut fixed top-1/2 left-1/2 z-50 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center gap-4 duration-200',
						classes?.content
					)}
				>
					{showCloseButton && (
						<DialogPrimitive.Close
							className={cn(
								'bg-fm-button-fill-secondary text-fm-icon-active hover:bg-fm-button-fill-secondary/80 flex cursor-pointer items-center justify-center gap-2 rounded-full p-3 backdrop-blur-sm',
								classes?.close
							)}
						>
							<CrossIcon className={cn('h-4 w-4', classes?.closeIcon)} />
							<span className="sr-only">Close</span>
						</DialogPrimitive.Close>
					)}

					<div
						className={cn(
							dialogVariants({ variant }),
							className,
							classes?.root
						)}
						{...props}
					>
						{borderSides.map((side) => (
							<div
								key={side}
								className={cn(
									dialogBorderVariants({ variant, side }),
									classes?.border
								)}
							/>
						))}
						{children}
					</div>
				</DialogPrimitive.Content>
			</DialogPortal>
		)
	}
)
DialogContent.displayName = DialogPrimitive.Content.displayName

// ...existing code...

const DialogHeader = ({
	className,
	...props
}: React.HTMLAttributes<HTMLDivElement>) => (
	<div
		className={cn(
			'flex flex-col space-y-1.5 text-center sm:text-left',
			className
		)}
		{...props}
	/>
)
DialogHeader.displayName = 'DialogHeader'

const DialogFooter = ({
	className,
	...props
}: React.HTMLAttributes<HTMLDivElement>) => (
	<div
		className={cn(
			'flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2',
			className
		)}
		{...props}
	/>
)
DialogFooter.displayName = 'DialogFooter'

const DialogTitle = React.forwardRef<
	React.ElementRef<typeof DialogPrimitive.Title>,
	React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
	<DialogPrimitive.Title
		ref={ref}
		className={cn(
			'text-fm-primary leading-fm-xl [font-size:var(--text-fm-xl)] font-medium',
			className
		)}
		{...props}
	/>
))
DialogTitle.displayName = DialogPrimitive.Title.displayName

const DialogDescription = React.forwardRef<
	React.ElementRef<typeof DialogPrimitive.Description>,
	React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
	<DialogPrimitive.Description
		ref={ref}
		className={cn(
			'text-fm-primary leading-fm-md [font-size:var(--text-fm-md)]',
			className
		)}
		{...props}
	/>
))
DialogDescription.displayName = DialogPrimitive.Description.displayName

export const useDialogCleanup = ({
	threshold = 1000,
}: {
	threshold: number
}) => {
	const handleDialogClose = () => {
		setTimeout(() => {
			if (document.body.style.pointerEvents === 'none') {
				document.body.style.pointerEvents = ''
			}
		}, threshold)
	}

	const handleEscape = (event: KeyboardEvent) => {
		if (event.key === 'Escape') {
			handleDialogClose()
		}
	}

	React.useEffect(() => {
		document.addEventListener('keydown', handleEscape)

		const cleanup = () => {
			document.removeEventListener('keydown', handleEscape)
			handleDialogClose()
		}

		// Cleanup on unmount
		return cleanup
	}, [])

	return { handleDialogClose, handleEscape }
}

export {
	Dialog,
	DialogPortal,
	DialogOverlay,
	DialogClose,
	DialogTrigger,
	DialogContent,
	DialogHeader,
	DialogFooter,
	DialogTitle,
	DialogDescription,
}
