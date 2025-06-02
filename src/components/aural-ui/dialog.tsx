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

interface IDialogOverlay {
	glass?: boolean
	opacity?: 'high' | 'medium' | 'low'
}

const DialogOverlay = React.forwardRef<
	React.ElementRef<typeof DialogPrimitive.Overlay>,
	React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay> &
		IDialogOverlay
>(({ opacity, glass, ...props }, ref) => (
	<DialogPrimitive.Overlay ref={ref} asChild {...props}>
		<Overlay opacity={opacity} glass={glass} />
	</DialogPrimitive.Overlay>
))

DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

export const dialogVariants = cva(
	'flex flex-col gap-5 rounded-fm-s bg-fm-surface-frosted/20 border-solid border-fm-divider-secondary p-4 backdrop-blur-sm w-full max-w-lg',
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
	extends React.HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof dialogVariants> {}

const DialogContent = React.forwardRef<
	React.ElementRef<typeof DialogPrimitive.Content>,
	DialogContentProps & IDialogOverlay
>(({ variant, className, opacity, glass, children, ...props }, ref) => (
	<DialogPortal>
		<DialogOverlay opacity={opacity} glass={glass} />
		<DialogPrimitive.Content
			ref={ref}
			className="data-[state=open]:animate-fm-zoomIn data-[state=closed]:animate-fm-zoomOut fixed top-1/2 left-1/2 z-50 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center gap-4 duration-200"
		>
			<DialogPrimitive.Close className="bg-fm-button-fill-secondary text-fm-icon-active hover:bg-fm-button-fill-secondary/80 flex cursor-pointer items-center justify-center gap-2 rounded-full p-3 backdrop-blur-sm">
				<CrossIcon className="h-4 w-4" />
				<span className="sr-only">Close</span>
			</DialogPrimitive.Close>
			<div className={cn(dialogVariants({ variant }), className)} {...props}>
				{children}
			</div>
		</DialogPrimitive.Content>
	</DialogPortal>
))
DialogContent.displayName = DialogPrimitive.Content.displayName

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
