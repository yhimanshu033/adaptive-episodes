import React, { ChangeEvent } from 'react'
import useAllUsersData from '@/hooks/query/use-all-users-data'
import useUserMembersQuery from '@/hooks/query/user-members-data'
import { setMemberQuery } from '@/store/admin-store'

import { Else, If } from '@/components/aural-ui/if-else'
import Input from '@/components/aural-ui/input'
import { List, ListItem } from '@/components/aural-ui/list'
import { ScrollArea } from '@/components/aural-ui/scroll-area'
import { Skeleton } from '@/components/aural-ui/skelton'
import IfElse from '@/components/if-else'

import { UserData } from '@/types/admin-types'

export default function SearchMembersForm({
	selectedValue,
	onUserSelect,
}: {
	onUserSelect: (email: string) => void
	selectedValue: string
}) {
	const { data, isLoading } = useAllUsersData('')
	const { data: membersData } = useUserMembersQuery()
	// const addMemberQuery = useAdminStore((state) => state.addMemberQuery)

	const users = React.useMemo(() => {
		if (!data || !membersData) {
			return []
		}

		const memberIds = new Set(
			membersData.members.map((member) => member.user.id)
		)
		return data.filter((user) => !memberIds.has(user.id))
	}, [data, membersData])

	const handleValueChange = (e: ChangeEvent<HTMLInputElement>) => {
		setMemberQuery(e.target.value)
		if (selectedValue) {
			onUserSelect('')
		}
	}

	const handleSelect = (user: UserData) => {
		onUserSelect(user.email)
		setMemberQuery(user.fullname)
	}

	return (
		<div>
			<Input
				unstyled
				className="text-fm-primary w-full border-none pr-4 outline-none"
				placeholder="Add people to share access"
				onChange={handleValueChange}
			/>
			<ScrollArea>
				<IfElse condition={isLoading}>
					<If>
						<Skeleton className="my-2 h-12 w-full" />
					</If>
					<Else>
						<List variant="elevated" className="w-full">
							{users.map((user, index) => (
								<ListItem
									key={index}
									classes={{ content: 'block' }}
									onClick={() => handleSelect(user)}
								>
									<h3 className="text-sm">{user?.fullname}</h3>
									<span className="text-fm-secondary text-xs">
										{user?.email}
									</span>
								</ListItem>
							))}
						</List>
					</Else>
				</IfElse>
			</ScrollArea>
		</div>
	)
}
