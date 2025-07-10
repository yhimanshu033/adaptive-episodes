import React from 'react'
import useAllUsersData from '@/hooks/query/use-all-users-data'
import useUserMembersQuery from '@/hooks/query/user-members-data'
import { CrossIcon } from '@/icons/cross-icon'
import useAdminStore, { setMemberQuery } from '@/store/admin-store'

import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from '@/components/aural-ui/command'
import { Divider } from '@/components/aural-ui/divider'
import { IconButton } from '@/components/aural-ui/icon-button'
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
		<Command
			classes={{
				list: 'backdrop-blur-none bg-transparent',
				root: 'relative overflow-visible',
			}}
		>
			<CommandInput
				classes={{
					wrapper:
						'rounded-full border-[0.5px] bg-fm-surface-frosted/20 transition-all duration-200 focus-within:border-fm-divider-contrast',
					icon: cn('transition-all duration-200', {
						'opacity-100': addMemberQuery.length > 0,
					}),
				}}
				className="relative"
				placeholder="Add people to share access"
				value={addMemberQuery}
				onValueChange={handleValueChange}
				autoComplete="off"
			/>
			<If condition={addMemberQuery.length > 0}>
				<IconButton
					size="small"
					variant="ghost"
					label="Clear search"
					onClick={() => handleValueChange('')}
					icon={<CrossIcon className="size-4" />}
					className="text-fm-icon-active hover:text-fm-icon-hover absolute top-1 right-4 z-50"
				/>
			</If>

			<div
				className={cn(
					addMemberQuery.length < 2 && 'hidden',
					'absolute top-13 right-0 left-0 z-50'
				)}
			>
				<ScrollArea
					classes={{
						viewport: 'h-51',
					}}
				>
					<CommandList className="bg-fm-surface-secondary max-h-none shadow-lg">
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
									<CommandGroup className="p-0">
										{users.map((user, index) => (
											<div
												key={`user-${index}`}
												className="bg-fm-surface-frosted/20"
											>
												<CommandItem
													onMouseDown={(e) => e.preventDefault()}
													onSelect={() => handleSelect(user)}
												>
													<div className="relative w-full">
														<h3 className="text-sm">
															{user?.fullname ?? 'Anonymous'}
														</h3>
														<div className="text-fm-secondary text-xs">
															{user.email}
														</div>
													</div>
												</CommandItem>
												<If condition={index < users.length - 1}>
													<div className="px-2">
														<Divider variant="dashed" />
													</div>
												</If>
											</div>
										))}
									</CommandGroup>
									<CommandEmpty className="text-fm-primary bg-fm-surface-frosted/20 py-3 text-sm">
										No user found
									</CommandEmpty>
									<div className="absolute top-0 right-0 left-0 block h-0.5 w-full bg-(image:--gradient-fm-stroke-neutral)"></div>
								</If>
							</Else>
						</IfElse>
					</CommandList>
				</ScrollArea>
			</div>
		</Command>
	)
}
export default SearchUser
