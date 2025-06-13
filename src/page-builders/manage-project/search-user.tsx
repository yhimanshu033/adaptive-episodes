import React from 'react'
import useAllUsersData from '@/hooks/query/use-all-users-data'
import useUserMembersQuery from '@/hooks/query/user-members-data'
import useAdminStore, { setMemberQuery } from '@/store/admin-store'

import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from '@/components/aural-ui/command'
import { ScrollArea } from '@/components/aural-ui/scroll-area'
import { Skeleton } from '@/components/aural-ui/skelton'
import IfElse, { Else, If } from '@/components/if-else'
import { cn } from '@/lib/utils/helpers'

import { UserData } from '@/types/admin-types'

const SearchUser = ({
	selectedValue,
	onUserSelect,
}: {
	onUserSelect: (email: string) => void
	selectedValue: string
}) => {
	const { data, isLoading } = useAllUsersData('')
	const { data: membersData } = useUserMembersQuery()
	const addMemberQuery = useAdminStore((state) => state.addMemberQuery)

	const users = React.useMemo(() => {
		if (!data || !membersData) {
			return []
		}

		const memberIds = new Set(
			membersData.members.map((member) => member.user.id)
		)
		return data.filter((user) => !memberIds.has(user.id))
	}, [data, membersData])

	const handleValueChange = (value: string) => {
		setMemberQuery(value)
		if (selectedValue) {
			onUserSelect('')
		}
	}

	const handleSelect = (user: UserData) => {
		onUserSelect(user.email)
		setMemberQuery(user.fullname)
	}

	return (
		<Command>
			<CommandInput
				classes={{
					wrapper: 'border-none rounded-full bg-fm-surface-frosted/20',
				}}
				placeholder="Search User"
				value={addMemberQuery}
				onValueChange={handleValueChange}
				autoComplete="off"
			/>
			<ScrollArea
				className={cn(
					addMemberQuery.length < 2 && 'hidden',
					'max-h-32 rounded-md'
				)}
			>
				<CommandList>
					<IfElse condition={isLoading}>
						<If>
							{Array.from({ length: 2 }).map((_, index) => (
								<CommandItem key={index} disabled>
									<Skeleton className="h-8 w-full" />
								</CommandItem>
							))}
						</If>
						<Else>
							<If condition={!selectedValue}>
								<CommandGroup>
									{users.map((user, index) => (
										<CommandItem
											className="bg-fm-surface-frosted/20"
											key={index}
											onMouseDown={(e) => e.preventDefault()}
											onSelect={() => handleSelect(user)}
										>
											<div>
												<h3 className="text-sm">
													{user?.fullname ?? 'Anonymous'}
												</h3>
												<span className="text-fm-secondary text-xs">
													{user.email}
												</span>
											</div>
										</CommandItem>
									))}
								</CommandGroup>
								<CommandEmpty className="text-muted-foreground py-2 text-sm">
									No user found
								</CommandEmpty>
							</If>
						</Else>
					</IfElse>
				</CommandList>
			</ScrollArea>
		</Command>
	)
}
export default SearchUser
