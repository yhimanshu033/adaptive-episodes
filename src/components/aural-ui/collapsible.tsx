import React, { forwardRef } from 'react'
import * as CollapsiblePrimitive from '@radix-ui/react-collapsible'
import { Slot } from '@radix-ui/react-slot'

import { AngleDownIcon } from '../../icons/angle-down-icon'
import { cn } from '../../lib/aural-ui/utils'
import { IconButton } from './icon-button'

const Collapsible = forwardRef<
	HTMLDivElement,
	React.ComponentPropsWithoutRef<typeof CollapsiblePrimitive.Collapsible>
>((props, ref) => {
	const { className, children, ...rest } = props
	return (
		<CollapsiblePrimitive.Collapsible
			ref={ref}
			className={cn(
				'border-fm-divider-secondary pb-fm-2xl w-full border-b border-solid',
				className
			)}
			{...rest}
		>
			{children}
		</CollapsiblePrimitive.Collapsible>
	)
})
Collapsible.displayName = 'Collapsible'

type CollapsibleTitleProps = React.HTMLAttributes<HTMLHeadingElement> & {
	asChild?: boolean
}

const CollapsibleTitle = forwardRef<HTMLHeadingElement, CollapsibleTitleProps>(
	(props, ref) => {
		const { asChild, children, className, ...rest } = props
		const Component = asChild ? Slot : 'h2'
		return (
			<Component
				ref={ref}
				className={cn(
					'text-fm-primary font-fm-text leading-fm-3xl [font-size:var(--text-fm-3xl)] tracking-wide',
					className
				)}
				{...rest}
			>
				{children}
			</Component>
		)
	}
)
CollapsibleTitle.displayName = 'CollapsibleTitle'

const CollapsibleTrigger = forwardRef<
	HTMLButtonElement,
	React.ComponentPropsWithoutRef<typeof CollapsiblePrimitive.CollapsibleTrigger>
>((props, ref) => {
	const { className, children, asChild, ...rest } = props
	return (
		<CollapsiblePrimitive.CollapsibleTrigger
			ref={ref}
			asChild={asChild}
			{...rest}
		>
			{React.isValidElement(children) ? (
				children
			) : (
				<IconButton
					className={cn(
						'text-fm-icon-active disabled:text-fm-icon-inactive [&>.toggle-icon]:transition-transform [&>.toggle-icon]:duration-50 data-[state=open]:[&>.toggle-icon]:-rotate-180',
						className
					)}
					variant="ghost"
					size="small"
					icon={
						<AngleDownIcon className="toggle-icon" height={32} width={32} />
					}
					label="Toggle Collapsible"
				/>
			)}
		</CollapsiblePrimitive.CollapsibleTrigger>
	)
})
CollapsibleTrigger.displayName = 'CollapsibleTrigger'

type CollapsibleHeaderProps = React.HTMLAttributes<HTMLDivElement> & {
	title: React.ReactNode
}

const CollapsibleHeader = forwardRef<HTMLDivElement, CollapsibleHeaderProps>(
	(props, ref) => {
		const { className, title, ...rest } = props
		return (
			<div
				ref={ref}
				className={cn('flex items-center justify-between gap-2', className)}
				{...rest}
			>
				<CollapsibleTrigger asChild>
					<button className="text-fm-icon-active disabled:text-fm-icon-inactive focus-visible:ring-fm-primary focus-visible:ring-offset-fm-contrast disabled:[&>.collapsible-title]:text-fm-inactive flex flex-1 cursor-pointer items-center justify-between text-left outline-none focus-visible:ring-2 focus-visible:ring-offset-2 [&>.toggle-icon]:transition-transform [&>.toggle-icon]:duration-50 data-[state=open]:[&>.toggle-icon]:-rotate-180">
						<CollapsibleTitle className="collapsible-title">
							{title}
						</CollapsibleTitle>
						<AngleDownIcon className="toggle-icon size-8" />
					</button>
				</CollapsibleTrigger>
			</div>
		)
	}
)
CollapsibleHeader.displayName = 'CollapsibleHeader'

const CollapsibleContent = forwardRef<
	HTMLDivElement,
	React.ComponentPropsWithoutRef<typeof CollapsiblePrimitive.CollapsibleContent>
>((props, ref) => {
	const { className, children, ...rest } = props
	return (
		<CollapsiblePrimitive.CollapsibleContent
			ref={ref}
			className={cn(
				'text-fm-tertiary leading-fm-xl [font-size:var(--text-fm-xl)] tracking-wider',
				className
			)}
			{...rest}
		>
			{children}
		</CollapsiblePrimitive.CollapsibleContent>
	)
})
CollapsibleContent.displayName = 'CollapsibleContent'

export {
	Collapsible,
	CollapsibleTrigger,
	CollapsibleContent,
	CollapsibleTitle,
	CollapsibleHeader,
}
