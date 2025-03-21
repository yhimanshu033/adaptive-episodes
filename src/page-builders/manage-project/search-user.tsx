import React from 'react'
import useAllUsersData from '@/hooks/query/use-all-users-data'
import useUserMembersQuery from '@/hooks/query/user-members-data'
import { Check } from 'lucide-react'

import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from '@/components/ui/command'
import { cn } from '@/lib/utils/helpers'

import { UserData } from '@/types/admin-types'

import UserInfo from '../episodes/user-info'

const SearchUser = ({
	selectedValue,
	onUserSelect,
}: {
	onUserSelect: (email: string) => void
	selectedValue: string
}) => {
	const [open, setOpen] = React.useState<boolean>(false)
	const [query, setQuery] = React.useState<string>('')
	const { data, isLoading } = useAllUsersData('')
	const { data: membersData } = useUserMembersQuery()

	const users = React.useMemo(() => {
		if (!data || !membersData) return []

		const memberIds = new Set(
			membersData.members.map((member) => member.user.id)
		)
		return data.filter((user) => !memberIds.has(user.id))
	}, [data, membersData])

	const handleValueChange = (value: string) => {
		setQuery(value)
		if (selectedValue) onUserSelect('')
	}

	const handleSelect = (user: UserData) => {
		onUserSelect(user.email)
		setQuery(user.fullname)
	}

	return (
		<div className="relative">
			<Command className="bg-transparent">
				<div className="relative flex items-center">
					<CommandInput
						placeholder="Search User"
						value={query}
						onValueChange={handleValueChange}
						onFocus={() => setOpen(true)}
						onBlur={() => setOpen(false)}
						autoComplete="off"
						groupClassName="border border-input rounded-md flex-1"
						className="h-9"
					/>
					{selectedValue && (
						<Check color="#B7D6A8" className="absolute right-2" size={16} />
					)}
				</div>
				<CommandList
					className={cn(
						'absolute top-11 z-20 w-full rounded-md border border-input bg-background',
						{
							hidden: !open,
						}
					)}
				>
					{!isLoading && (
						<CommandEmpty className="text-sm text-muted-foreground">
							No user found
						</CommandEmpty>
					)}
					<CommandGroup>
						{isLoading ? (
							<CommandItem disabled>Loading users..</CommandItem>
						) : (
							users.map((user, index) => (
								<CommandItem
									key={index}
									onMouseDown={(e) => e.preventDefault()}
									onSelect={() => handleSelect(user)}
									className="cursor-pointer"
								>
									<UserInfo user={user} showFullName showEmail />
								</CommandItem>
							))
						)}
					</CommandGroup>
				</CommandList>
			</Command>
		</div>
	)
}
export default SearchUser
