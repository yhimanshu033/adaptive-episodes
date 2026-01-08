import * as React from 'react'
import { cva, VariantProps } from 'class-variance-authority'
import { Drawer as DrawerPrimitive } from 'vaul'

import { cn } from '../../lib/aural-ui/utils'
import { Overlay } from './overlay'

function Drawer({
	...props
}: React.ComponentProps<typeof DrawerPrimitive.Root>) {
	return <DrawerPrimitive.Root data-slot="drawer" {...props} />
}

function DrawerTrigger({
	...props
}: React.ComponentProps<typeof DrawerPrimitive.Trigger>) {
	return <DrawerPrimitive.Trigger data-slot="drawer-trigger" {...props} />
}

function DrawerPortal({
	...props
}: React.ComponentProps<typeof DrawerPrimitive.Portal>) {
	return <DrawerPrimitive.Portal data-slot="drawer-portal" {...props} />
}

function DrawerClose({
	...props
}: React.ComponentProps<typeof DrawerPrimitive.Close>) {
	return <DrawerPrimitive.Close data-slot="drawer-close" {...props} />
}

interface IDrawerOverlay {
	classes?: {
		content?: string
		overlay?: string
		root?: string
	}
	glass?: 'high' | 'medium' | 'low' | 'none'
	noise?: 'high' | 'medium' | 'low' | 'none'
	opacity?: 'high' | 'medium' | 'low' | 'none'
}

function DrawerOverlay({
	className,
	opacity,
	glass,
	noise,
	classes,
	...props
}: React.ComponentProps<typeof DrawerPrimitive.Overlay> & IDrawerOverlay) {
	return (
		<DrawerPrimitive.Overlay data-slot="drawer-overlay" asChild {...props}>
			<Overlay
				opacity={opacity}
				glass={glass}
				noise={noise}
				className={cn(
					'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50',
					className,
					classes?.overlay
				)}
			/>
		</DrawerPrimitive.Overlay>
	)
}

export const drawerVariants = cva(
	'flex flex-col gap-5 w-full rounded-fm-s p-4  relative group/drawer-content fixed z-50 h-auto py-2 text-white',
	{
		variants: {
			variant: {
				neutral:
					'bg-fm-surface-frosted/20 border-solid border-fm-divider-secondary backdrop-blur-sm',
				gradient:
					'bg-fm-surface-primary [background-image:var(--color-fm-gradient-white)] border-0',
			},
		},
		defaultVariants: {
			variant: 'neutral',
		},
	}
)

interface DrawerContentProps
	extends
		React.HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof drawerVariants> {
	showOverlay?: boolean
	showSwipeButton?: boolean
}

const DrawerContent = React.forwardRef<
	React.ElementRef<typeof DrawerPrimitive.Content>,
	DrawerContentProps & IDrawerOverlay
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
			showOverlay = true,
			showSwipeButton = false,
			...props
		},
		ref
	) => {
		return (
			<DrawerPortal data-slot="drawer-portal">
				{showOverlay && (
					<DrawerOverlay
						opacity={opacity}
						glass={glass}
						noise={noise}
						classes={classes}
					/>
				)}
				<DrawerPrimitive.Content
					ref={ref}
					data-slot="drawer-content"
					className={cn(
						drawerVariants({ variant }),
						'data-[vaul-drawer-direction=top]:inset-x-0 data-[vaul-drawer-direction=top]:top-0 data-[vaul-drawer-direction=top]:mb-24 data-[vaul-drawer-direction=top]:max-h-[80vh] data-[vaul-drawer-direction=top]:rounded-b-lg',
						'data-[vaul-drawer-direction=bottom]:inset-x-0 data-[vaul-drawer-direction=bottom]:bottom-0 data-[vaul-drawer-direction=bottom]:mt-24 data-[vaul-drawer-direction=bottom]:max-h-[80vh] data-[vaul-drawer-direction=bottom]:rounded-t-lg',
						'data-[vaul-drawer-direction=right]:inset-y-0 data-[vaul-drawer-direction=right]:right-0 data-[vaul-drawer-direction=right]:w-3/4 data-[vaul-drawer-direction=right]:rounded-l-lg data-[vaul-drawer-direction=right]:sm:max-w-sm',
						'data-[vaul-drawer-direction=left]:inset-y-0 data-[vaul-drawer-direction=left]:left-0 data-[vaul-drawer-direction=left]:w-3/4 data-[vaul-drawer-direction=left]:rounded-r-lg data-[vaul-drawer-direction=left]:sm:max-w-sm',
						className,
						classes?.content
					)}
					{...props}
				>
					{showSwipeButton && (
						<div className="bg-fm-surface-primary mx-auto mt-4 hidden h-2 w-[100px] shrink-0 rounded-full group-data-[vaul-drawer-direction=bottom]/drawer-content:block" />
					)}
					{children}
				</DrawerPrimitive.Content>
			</DrawerPortal>
		)
	}
)
DrawerContent.displayName = DrawerPrimitive.Content.displayName

function DrawerHeader({ className, ...props }: React.ComponentProps<'div'>) {
	return (
		<div
			data-slot="drawer-header"
			className={cn(
				'flex flex-col gap-0.5 p-4 group-data-[vaul-drawer-direction=bottom]/drawer-content:text-center group-data-[vaul-drawer-direction=top]/drawer-content:text-center md:gap-1.5 md:text-left',
				className
			)}
			{...props}
		/>
	)
}

function DrawerFooter({ className, ...props }: React.ComponentProps<'div'>) {
	return (
		<div
			data-slot="drawer-footer"
			className={cn('mt-auto flex flex-col gap-2 p-4', className)}
			{...props}
		/>
	)
}

function DrawerTitle({
	className,
	...props
}: React.ComponentProps<typeof DrawerPrimitive.Title>) {
	return (
		<DrawerPrimitive.Title
			data-slot="drawer-title"
			className={cn('font-semibold text-white', className)}
			{...props}
		/>
	)
}

function DrawerDescription({
	className,
	...props
}: React.ComponentProps<typeof DrawerPrimitive.Description>) {
	return (
		<DrawerPrimitive.Description
			data-slot="drawer-description"
			className={cn('text-sm text-white', className)}
			{...props}
		/>
	)
}

export {
	Drawer,
	DrawerPortal,
	DrawerOverlay,
	DrawerTrigger,
	DrawerClose,
	DrawerContent,
	DrawerHeader,
	DrawerFooter,
	DrawerTitle,
	DrawerDescription,
}
