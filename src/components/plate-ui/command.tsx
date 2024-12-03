/* eslint-disable react/no-unknown-property */
'use client'

import * as React from 'react'
import { cn, withCn, withRef } from '@udecode/cn'
import { Command as CommandPrimitive } from 'cmdk'

import { Icons } from '@/components/icons'

export const Command = withCn(
	CommandPrimitive,
	'flex size-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground'
)

export const CommandInput = withRef<typeof CommandPrimitive.Input>(
	({ className, ...props }, ref) => (
		<div className="flex items-center border-b px-3" cmdk-input-wrapper="">
			<Icons.search className="mr-2 size-4 shrink-0 opacity-50" />
			<CommandPrimitive.Input
				ref={ref}
				className={cn(
					'flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50',
					className
				)}
				{...props}
			/>
		</div>
	)
)

export const CommandList = withCn(
	CommandPrimitive.List,
	'max-h-[500px] overflow-y-auto overflow-x-hidden'
)

export const CommandEmpty = withCn(
	CommandPrimitive.Empty,
	'py-6 text-center text-sm'
)

export const CommandItem = withCn(
	CommandPrimitive.Item,
	'relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled=true]:pointer-events-none data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground data-[disabled=true]:opacity-50'
)
