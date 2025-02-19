'use client'

import * as React from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from '@/components/ui/command'
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils/helpers'

import { MemberData } from '@/types/admin-types'

const WriterCombobox = ({ members }: { members?: MemberData[] }) => {
	const [open, setOpen] = React.useState<boolean>(false)
	const [value, setValue] = React.useState<string>('')

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					role="combobox"
					aria-expanded={open}
					className="w-[200px] justify-between"
				>
					{value || 'Unassigned'}
					<ChevronsUpDown className="opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-[200px] p-0">
				<Command>
					<CommandInput placeholder="Search Writer" className="h-9" />
					<CommandList>
						<CommandEmpty>No writer found.</CommandEmpty>
						<CommandGroup>
							{members?.map((member) => (
								<CommandItem
									key={member.user.id}
									value={member.user.fullname}
									onSelect={(currentValue) => {
										setValue(currentValue === value ? '' : currentValue)
										setOpen(false)
									}}
								>
									{member.user.fullname}
									<Check
										className={cn(
											'ml-auto',
											value === member.user.fullname
												? 'opacity-100'
												: 'opacity-0'
										)}
									/>
								</CommandItem>
							))}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	)
}

export default WriterCombobox
