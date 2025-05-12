import React from 'react'
import useAllUsersData from '@/hooks/query/use-all-users-data'
import useUserMembersQuery from '@/hooks/query/user-members-data'
import useAdminStore, { setMemberQuery } from '@/store/admin-store'
import { Check } from 'lucide-react'

import IfElse, { Else, If } from '@/components/if-else'
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from '@/components/ui/command'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'

import { UserData } from '@/types/admin-types'

import UserInfo from '../episodes/info/user-info'

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
		<Command className="bg-transparent">
			<div className="relative flex items-center">
				<CommandInput
					placeholder="Search User"
					value={addMemberQuery}
					onValueChange={handleValueChange}
					autoComplete="off"
					groupClassName="border border-input rounded-md flex-1"
					className="h-9"
				/>
				{selectedValue && (
					<Check color="#B7D6A8" className="absolute right-2" size={16} />
				)}
			</div>

			<ScrollArea className="mt-2 max-h-[52vh] rounded-md border border-input">
				<CommandList className="max-h-none">
					<IfElse condition={isLoading}>
						<If>
							{Array.from({ length: 9 }).map((_, index) => (
								<CommandItem key={index} disabled>
									<Skeleton className="h-8 w-full" />
								</CommandItem>
							))}
						</If>
						<Else>
							<CommandGroup>
								{users.map((user, index) => (
									<CommandItem
										key={index}
										onMouseDown={(e) => e.preventDefault()}
										onSelect={() => handleSelect(user)}
										className="cursor-pointer py-3"
									>
										<UserInfo user={user} showFullName showEmail />
									</CommandItem>
								))}
							</CommandGroup>
						</Else>
					</IfElse>
				</CommandList>
				<CommandEmpty className="my-5 text-sm text-muted-foreground">
					No user found
				</CommandEmpty>
			</ScrollArea>
		</Command>
	)
}
export default SearchUser
