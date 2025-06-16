import * as React from 'react'
import { Command as CommandPrimitive } from 'cmdk'

import { SearchIcon } from '../../icons/search-icon'
import { cn } from '../../lib/aural-ui/utils'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from './dialog'
import {
	List,
	ListGroup,
	ListItem,
	ListLabel,
	ListSeparator,
	type ListProps,
} from './list'

function Command({
	className,
	listProps = {},
	classes = {},
	...props
}: React.ComponentProps<typeof CommandPrimitive> & {
	classes?: {
		list?: string
		root?: string
	}
	listProps?: Partial<ListProps>
}) {
	return (
		<CommandPrimitive
			data-slot="command"
			className={cn(
				'flex w-full flex-col overflow-hidden',
				className,
				classes?.root
			)}
			{...props}
		>
			<List
				className={cn('rounded-md border-0 shadow-none', classes?.list)}
				showBorder={false}
				{...listProps}
			>
				{props.children}
			</List>
		</CommandPrimitive>
	)
}

function CommandDialog({
	title = 'Command Palette',
	description = 'Search for a command to run...',
	children,
	className,
	showCloseButton = true,
	listProps = {},
	classes = {},
	...props
}: React.ComponentProps<typeof Dialog> & {
	className?: string
	classes?: {
		list?: string
		root?: string
	}
	description?: string
	listProps?: Partial<ListProps>
	showCloseButton?: boolean
	title?: string
}) {
	return (
		<Dialog {...props}>
			<DialogHeader className="sr-only">
				<DialogTitle>{title}</DialogTitle>
				<DialogDescription>{description}</DialogDescription>
			</DialogHeader>
			<DialogContent
				className={cn('overflow-hidden p-0', className, classes?.root)}
				showCloseButton={showCloseButton}
			>
				<Command listProps={listProps} classes={{ list: classes?.list }}>
					{children}
				</Command>
			</DialogContent>
		</Dialog>
	)
}

function CommandInput({
	className,
	placeholder = 'Type a command or search...',
	classes = {},
	...props
}: React.ComponentProps<typeof CommandPrimitive.Input> & {
	classes?: {
		icon?: string
		input?: string
		wrapper?: string
	}
	placeholder?: string
}) {
	return (
		<div
			data-slot="command-input-wrapper"
			className={cn(
				'border-fm-divider-primary flex items-center border-b px-3',
				classes?.wrapper
			)}
		>
			<SearchIcon
				className={cn(
					'text-fm-icon-active mr-2 size-4 shrink-0 opacity-50',
					classes?.icon
				)}
			/>
			<CommandPrimitive.Input
				data-slot="command-input"
				className={cn(
					'text-fm-primary placeholder:text-fm-placeholder font-fm-text flex h-10 w-full bg-transparent py-3 text-sm outline-none disabled:cursor-not-allowed disabled:opacity-50',
					className,
					classes?.input
				)}
				placeholder={placeholder}
				{...props}
			/>
		</div>
	)
}

function CommandList({
	className,
	classes = {},
	...props
}: React.ComponentProps<typeof CommandPrimitive.List> & {
	classes?: {
		root?: string
	}
}) {
	return (
		<CommandPrimitive.List
			data-slot="command-list"
			className={cn(
				'max-h-[300px] overflow-x-hidden overflow-y-auto overscroll-contain',
				className,
				classes?.root
			)}
			{...props}
		/>
	)
}

function CommandEmpty({
	className,
	classes = {},
	...props
}: React.ComponentProps<typeof CommandPrimitive.Empty> & {
	classes?: {
		root?: string
	}
}) {
	return (
		<CommandPrimitive.Empty
			data-slot="command-empty"
			className={cn(
				'text-fm-secondary py-6 text-center text-sm',
				className,
				classes?.root
			)}
			{...props}
		/>
	)
}

function CommandGroup({
	className,
	classes = {},
	...props
}: React.ComponentProps<typeof CommandPrimitive.Group> & {
	classes?: {
		root?: string
	}
}) {
	return (
		<CommandPrimitive.Group
			data-slot="command-group"
			className={cn(
				'overflow-hidden p-1',
				'[&_[cmdk-group-heading]]:px-0 [&_[cmdk-group-heading]]:py-0',
				className,
				classes?.root
			)}
			{...props}
		>
			<ListGroup>{props.children}</ListGroup>
		</CommandPrimitive.Group>
	)
}

type CommandLabelProps = React.ComponentProps<typeof ListLabel>

function CommandLabel({
	className,
	children,
	classes = {},
	...props
}: CommandLabelProps) {
	return (
		<ListLabel
			data-slot="command-label"
			className={className}
			{...props}
			classes={classes}
		>
			{children}
		</ListLabel>
	)
}

function CommandSeparator({
	className,
	classes = {},
	...props
}: React.ComponentProps<typeof CommandPrimitive.Separator> & {
	classes?: {
		root?: string
	}
}) {
	return (
		<CommandPrimitive.Separator
			data-slot="command-separator"
			className={className}
			{...props}
			asChild
		>
			<ListSeparator classes={classes} />
		</CommandPrimitive.Separator>
	)
}

type CommandItemProps = React.ComponentProps<typeof CommandPrimitive.Item> & {
	classes?: {
		root?: string
		shortcut?: string
	}
	shortcut?: string
	variant?: 'default' | 'destructive'
}

function CommandItem({
	className,
	children,
	variant = 'default',
	shortcut,
	classes = {},
	...props
}: CommandItemProps) {
	return (
		<CommandPrimitive.Item
			data-slot="command-item"
			className={cn('group', className)}
			{...props}
		>
			<ListItem
				variant={variant === 'destructive' ? 'destructive' : 'default'}
				disabled={props.disabled}
				shortcut={shortcut}
				className={cn(
					'rounded-fm-s cursor-pointer',
					'group-data-[selected=true]:bg-fm-surface-frosted/20',
					'group-data-[disabled=true]:cursor-not-allowed',
					'group-data-[disabled=true]:opacity-50',
					// Icon styling for command items
					'[&_svg]:size-4 [&_svg]:shrink-0',
					classes?.root
				)}
				classes={{
					shortcut: classes?.shortcut,
				}}
			>
				{children}
			</ListItem>
		</CommandPrimitive.Item>
	)
}

function CommandShortcut({
	className,
	classes = {},
	...props
}: React.ComponentProps<'span'> & {
	classes?: {
		root?: string
	}
}) {
	return (
		<span
			data-slot="command-shortcut"
			className={cn(
				'font-fm-brand text-fm-secondary ml-auto text-xs tracking-widest opacity-60',
				className,
				classes?.root
			)}
			{...props}
		/>
	)
}

export {
	Command,
	CommandDialog,
	CommandInput,
	CommandList,
	CommandEmpty,
	CommandGroup,
	CommandLabel,
	CommandItem,
	CommandShortcut,
	CommandSeparator,
}

export type { CommandItemProps, CommandLabelProps }
