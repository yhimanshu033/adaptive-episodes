'use client'

import * as React from 'react'
import { CrossIcon } from '@/icons/cross-icon'
import { toast } from 'sonner'

import { Badge } from '@/components/aural-ui/badge'
import {
	Command,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from '@/components/aural-ui/command'
import { IconButton } from '@/components/aural-ui/icon-button'
import { If } from '@/components/aural-ui/if-else'
import { ListItem } from '@/components/aural-ui/list'
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/aural-ui/popover'
import { cn } from '@/lib/aural-ui/utils'

export type MultiSelectOption = Record<'value' | 'label', string>

interface IMultiSelectProps {
	data?: MultiSelectOption[]
	disabled?: boolean
	onSelect: (val: MultiSelectOption) => void
	onUnSelect?: (val: MultiSelectOption) => void
	selected: MultiSelectOption[]
}
export function MultiSelect({
	data,
	onSelect,
	selected: propSelected,
	onUnSelect,
	disabled,
}: IMultiSelectProps) {
	const inputRef = React.useRef<HTMLInputElement>(null)
	const [inputValue, setInputValue] = React.useState('')

	const selected = React.useMemo(() => {
		return propSelected.filter((it) => it.value.trim().length > 0)
	}, [propSelected])

	const handleUnselect = React.useCallback(
		(option: MultiSelectOption) => {
			onUnSelect?.(option)
		},
		[onUnSelect]
	)

	const handleSelectInput = React.useCallback(() => {
		const value = inputValue.trim().toLowerCase()
		const alreadySelected = selected.some(
			(selectedItem) => selectedItem.value.toLowerCase() === value
		)
		if (!value) {
			return
		}
		if (alreadySelected) {
			toast.info(`${inputValue} is already selected!`)
			return
		}
		setInputValue('')
		onSelect({
			label: inputValue,
			value: value,
		})
	}, [onSelect, inputValue, selected])

	const selectables = React.useMemo(() => {
		return (
			data?.filter(
				(item) =>
					!selected.some((selectedItem) => selectedItem.value === item.value)
			) ?? []
		)
	}, [data, selected])

	return (
		<Popover>
			<PopoverTrigger asChild>
				<button
					disabled={disabled}
					className={cn(
						'flex w-full flex-wrap gap-1',
						{
							'bg-fm-tertiary/10 border-fm-divider-primary border p-2':
								!disabled,
						},
						{ 'min-h-9': !selected.length }
					)}
				>
					{selected.map((opt) => {
						return (
							<Badge key={opt.value}>
								{opt.label}
								<If condition={!disabled}>
									<IconButton
										label="Deselect"
										icon={<CrossIcon className="size-2" />}
										className="size-3"
										onClick={(e) => {
											e.preventDefault()
											e.stopPropagation()
											handleUnselect(opt)
										}}
										size="small"
									/>
								</If>
							</Badge>
						)
					})}
				</button>
			</PopoverTrigger>
			<PopoverContent>
				<Command className="overflow-visible bg-transparent">
					<CommandInput
						ref={inputRef}
						value={inputValue}
						classes={{
							icon: 'hidden',
						}}
						onValueChange={setInputValue}
						onKeyDown={(e) => {
							if (e.key.toLowerCase() === 'enter' || e.key === ',') {
								e.preventDefault()
								handleSelectInput()
							}
						}}
						placeholder="Type here..."
						className="placeholder:text-muted-foreground ml-2 flex-1 bg-transparent outline-none"
					/>
					<div className="relative mt-2">
						<If condition={!!data && data?.length > 0}>
							<If condition={!!inputValue}>
								<ListItem
									key={inputValue}
									onClick={() => {
										handleSelectInput()
									}}
									className={'cursor-pointer'}
								>
									{inputValue}
								</ListItem>
							</If>
							<CommandList>
								<CommandGroup className="h-full overflow-auto">
									{selectables.map((item) => {
										return (
											<CommandItem
												key={item.value}
												onMouseDown={(e) => {
													e.preventDefault()
													e.stopPropagation()
												}}
												onSelect={() => {
													setInputValue('')
													onSelect(item)
												}}
												className={'cursor-pointer'}
											>
												{item.label}
											</CommandItem>
										)
									})}
								</CommandGroup>
							</CommandList>
						</If>
					</div>
				</Command>
			</PopoverContent>
		</Popover>
	)
}
