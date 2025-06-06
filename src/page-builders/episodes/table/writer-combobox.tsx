'use client'

import * as React from 'react'
import useWriterUpdateMutation from '@/hooks/mutation/use-writer-update-mutation'
import useUserMembersQuery from '@/hooks/query/user-members-data'
import useIsGerman from '@/hooks/use-is-german'
import { TickIcon } from '@/icons/tick-icon'
import { useTranslations } from 'next-intl'

import { Divider } from '@/components/aural-ui/divider'
import {
	Select,
	SelectContent,
	SelectRoot,
	SelectTrigger,
	SelectWrapper,
} from '@/components/aural-ui/select'
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from '@/components/ui/command'
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
	const { mutate } = useWriterUpdateMutation(chapterId || '')
	const isGerman = useIsGerman()

	const { isWriter } = useProjectId()

	const { data } = useUserMembersQuery()
	const members = data?.members || []

	const selectedMember = members?.find(
		(member) => member.user.id === Number(value)
	)
	const dict = useTranslations('common')

	if (!isGerman) {
		return null
	}

	return (
		<SelectRoot className={className}>
			<SelectWrapper>
				<Select>
					<SelectTrigger
						decoration="outline"
						className="font-fm-brand text-xs uppercase"
						classes={{
							root: 'h-10 text-sm',
							icon: 'text-fm-icon-inactive',
						}}
						disabled={!isWriter}
					>
						{!selectedMember?.user
							? dict('unassigned')
							: selectedMember?.user?.fullname}
					</SelectTrigger>
					<SelectContent>
						<Command
							className="bg-fm-surface-frosted/1 backdrop-blur-lg"
							defaultValue={selectedMember?.user?.fullname}
						>
							<CommandInput placeholder="Search Writer" className="h-10" />
							<CommandList>
								<CommandEmpty className="font-fm-text h-10 px-4 py-2">
									No writer found.
								</CommandEmpty>
								<CommandGroup>
									{members?.map((member) => (
										<>
											<CommandItem
												className="font-fm-text h-10 p-3"
												key={member.user.id}
												value={String(member.user.fullname)}
												onSelect={() => {
													if (!isWriter) {
														return
													}
													setValue(String(member.user.id))
													mutate(member.user.id)
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
											</CommandItem>
											<Divider variant="dashed" />
										</>
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
