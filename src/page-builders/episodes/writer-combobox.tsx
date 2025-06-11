'use client'

import * as React from 'react'
import useWriterUpdateMutation from '@/hooks/mutation/use-writer-update-mutation'
import useUserMembersQuery from '@/hooks/query/user-members-data'
import useAccessChecks from '@/hooks/use-access-checks'
import UserInfo from '@/page-builders/episodes/user-info'
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
import useProjectId from '@/providers/project-id-provider'
import { cn } from '@/lib/utils/helpers'

const WriterCombobox = ({
	chapterId,
	selectedMemberId,
	className,
}: {
	chapterId?: string
	className?: string
	selectedMemberId?: string
}) => {
	const [open, setOpen] = React.useState<boolean>(false)
	const [value, setValue] = React.useState<string>(selectedMemberId || '')
	const { mutate } = useWriterUpdateMutation(chapterId || '')
	const { isGerman, isOriginal } = useAccessChecks()

	const { isWriter } = useProjectId()

	const { data } = useUserMembersQuery()
	const members = data?.members || []

	const selectedMember = members?.find(
		(member) => member.user.id === Number(value)
	)

	if (!(isGerman || isOriginal)) {
		return null
	}

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild disabled={!chapterId}>
				<Button
					variant="outline"
					role="combobox"
					aria-expanded={open}
					disabled={!isWriter}
					className={cn('w-[200px] justify-between', className)}
				>
					<UserInfo user={selectedMember?.user} />
					<ChevronsUpDown className="opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-[200px] p-0">
				<Command defaultValue={selectedMember?.user.fullname}>
					<CommandInput placeholder="Search Writer" className="h-9" />
					<CommandList>
						<CommandEmpty>No writer found.</CommandEmpty>
						<CommandGroup>
							{members?.map((member) => (
								<CommandItem
									key={member.user.id}
									value={String(member.user.fullname)}
									onSelect={() => {
										if (!isWriter) {
											return
										}
										setValue(String(member.user.id))
										mutate(member.user.id)
										setOpen(false)
									}}
								>
									{member.user.fullname}
									<Check
										className={cn(
											'ml-auto',
											selectedMember?.user.id === member.user.id
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
