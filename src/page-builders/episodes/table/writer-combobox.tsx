'use client'

import * as React from 'react'
import useWriterUpdateMutation from '@/hooks/mutation/use-writer-update-mutation'
import useUserMembersQuery from '@/hooks/query/user-members-data'
import useAccessChecks from '@/hooks/use-access-checks'
import { TickIcon } from '@/icons/tick-icon'
import { useTranslations } from 'next-intl'

import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from '@/components/aural-ui/command'
import { Divider } from '@/components/aural-ui/divider'
import {
	Select,
	SelectContent,
	SelectRoot,
	SelectTrigger,
	SelectWrapper,
} from '@/components/aural-ui/select'
import useProjectId from '@/providers/project-id-provider'
import { cn } from '@/lib/utils/helpers'

const WriterCombobox = ({
	chapterId,
	className,
	selectedMemberId,
}: {
	chapterId?: string
	className?: string
	selectedMemberId?: string
}) => {
	const [value, setValue] = React.useState<string>(selectedMemberId || '')
	const [open, setOpen] = React.useState(false)
	const triggerRef = React.useRef<HTMLButtonElement>(null)

	const { mutate } = useWriterUpdateMutation(chapterId || '')
	const { isGerman, isOriginal } = useAccessChecks()

	const { isWriter } = useProjectId()

	const { data } = useUserMembersQuery()
	const members = data?.members || []

	const selectedMember = members?.find(
		(member) => member.user.id === Number(value)
	)
	const dict = useTranslations('common')

	// Handle focus removal when select closes
	const handleOpenChange = (isOpen: boolean) => {
		setOpen(isOpen)
		if (!isOpen && triggerRef.current) {
			triggerRef.current.blur()
		}
	}

	if (!(isGerman || isOriginal)) {
		return null
	}

	return (
		<SelectRoot className={className}>
			<SelectWrapper>
				<Select open={open} onOpenChange={handleOpenChange}>
					<SelectTrigger
						decoration="outline"
						className="font-fm-brand text-xs tracking-wider uppercase"
						classes={{
							root: cn('h-10 text-sm focus:border-fm-divider-primary', {
								'pl-0 border-0 cursor-default': !isWriter,
							}),
							icon: cn(
								'text-fm-icon-inactive group-data-[state=open]:text-fm-primary',
								{ hidden: !isWriter }
							),
						}}
						disabled={!isWriter}
					>
						<span className="text-fm-primary">
							{!selectedMember?.user
								? dict('unassigned')
								: selectedMember?.user?.fullname}
						</span>
					</SelectTrigger>
					<SelectContent>
						<Command
							classes={{
								list: 'backdrop-blur-none bg-transparent',
							}}
							defaultValue={selectedMember?.user?.fullname}
						>
							<CommandInput placeholder="Search Writer" />
							<CommandList>
								<CommandEmpty className="font-fm-text py-2">
									No writer found.
								</CommandEmpty>
								<CommandGroup>
									{members?.map((member) => (
										<CommandItem
											className="font-fm-text text-sm"
											key={member.user.id}
											value={String(member.user.fullname)}
											onSelect={() => {
												if (!isWriter) {
													return
												}
												setValue(String(member.user.id))
												mutate(member.user.id)
												handleOpenChange(false)
											}}
										>
											{member.user.fullname}
											<TickIcon
												className={cn(
													'ml-auto',
													selectedMember?.user.id === member.user.id
														? 'opacity-100'
														: 'opacity-0'
												)}
											/>
											<Divider variant="dashed" className="my-0.5" />
										</CommandItem>
									))}
								</CommandGroup>
							</CommandList>
						</Command>
					</SelectContent>
				</Select>
			</SelectWrapper>
		</SelectRoot>
	)
}

export default WriterCombobox
