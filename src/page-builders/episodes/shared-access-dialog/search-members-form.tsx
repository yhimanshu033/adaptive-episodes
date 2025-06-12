import React from 'react'
import { setMemberQuery } from '@/store/admin-store'

import Search from '@/components/aural-ui/search'

export default function SearchMembersForm({
	selectedValue,
	onUserSelect,
}: {
	onUserSelect: (email: string) => void
	selectedValue: string
}) {
	// const { data } = useAllUsersData('')
	// const { data: membersData } = useUserMembersQuery()
	// const addMemberQuery = useAdminStore((state) => state.addMemberQuery)

	// const users = React.useMemo(() => {
	// 	if (!data || !membersData) {
	// 		return []
	// 	}
	//
	// 	const memberIds = new Set(
	// 		membersData.members.map((member) => member.user.id)
	// 	)
	// 	return data.filter((user) => !memberIds.has(user.id))
	// }, [data, membersData])

	const handleValueChange = (value: string) => {
		setMemberQuery(value)
		if (selectedValue) {
			onUserSelect('')
		}
	}

	// const handleSelect = (user: UserData) => {
	// 	onUserSelect(user.email)
	// 	setMemberQuery(user.fullname)
	// }

	return (
		<div>
			<Search
				placeholder="Add people to share access"
				onChange={handleValueChange}
				// results={users}
			></Search>
		</div>
	)

	// return (
	// 	<div>
	// 		<Input
	// 			unstyled
	// 			className="text-fm-primary w-full border-none pr-4 outline-none"
	// 			placeholder="Add people to share access"
	// 			onChange={handleValueChange}
	// 		/>
	// 		<ScrollArea className="[&>[data-radix-scroll-area-viewport]]:max-h-44">
	// 			<IfElse condition={isLoading}>
	// 				<If>
	// 					<Skeleton className="my-2 h-12 w-full" />
	// 				</If>
	// 				<Else>
	// 					{/*<List variant="elevated" className="w-full">*/}
	// 					{/*	{users.map((user, index) => (*/}
	// 					{/*		<ListItem*/}
	// 					{/*			key={index}*/}
	// 					{/*			classes={{ content: 'block' }}*/}
	// 					{/*			onClick={() => handleSelect(user)}*/}
	// 					{/*		>*/}
	// 					{/*			<h3 className="text-sm">{user?.fullname}</h3>*/}
	// 					{/*			<span className="text-fm-secondary text-xs">*/}
	// 					{/*				{user?.email}*/}
	// 					{/*			</span>*/}
	// 					{/*		</ListItem>*/}
	// 					{/*	))}*/}
	// 					{/*</List>*/}
	// 				</Else>
	// 			</IfElse>
	// 		</ScrollArea>
	// 	</div>
	// )
}
