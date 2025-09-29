import React, { useEffect, useRef, useState } from 'react'
import useAllUsersData from '@/hooks/query/use-all-users-data'
import useUserMembersQuery from '@/hooks/query/user-members-data'
import { useDebounce } from '@/hooks/use-debounce'
import { CrossIcon } from '@/icons/cross-icon'
import { setMemberQuery } from '@/store/admin-store'
import { useEpisodeStore } from '@/store/episode-store'
import { useVirtualizer } from '@tanstack/react-virtual'

import {
	Command,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from '@/components/aural-ui/command'
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
	const [query, setQuery] = useState('')
	const debouncedQuery = useDebounce(query, 500)

	const { data, isLoading } = useAllUsersData(debouncedQuery)
	const { data: membersData } = useUserMembersQuery()
	const { setShowSharedList } = useEpisodeStore()

	const parentRef = useRef<HTMLDivElement>(null)

	const users = React.useMemo(() => {
		if (!data || !membersData) {
			return []
		}

		const memberIds = new Set(
			membersData.members.map((member) => member.user.id)
		)
		return data.filter((user) => !memberIds.has(user.id))
	}, [data, membersData])

	const virtualizer = useVirtualizer({
		count: users.length,
		getScrollElement: () => parentRef.current,
		estimateSize: () => 60,
		overscan: 5, // Render 5 extra items for smooth scrolling
	})

	const handleSelect = (user: UserData) => {
		onUserSelect(user.email)
		setQuery(user.fullname)
		setMemberQuery(user.fullname)
		setShowSharedList(true)
	}

	const handleValueChange = (value: string) => {
		setQuery(value)
		if (selectedValue) {
			onUserSelect('')
		}
	}

	useEffect(() => {
		setMemberQuery(debouncedQuery)
	}, [debouncedQuery])

	return (
		<Command
			classes={{
				list: 'backdrop-blur-none bg-transparent',
				root: 'relative overflow-visible',
			}}
			shouldFilter={false}
		>
			<CommandInput
				classes={{
					wrapper:
						'rounded-full border-[0.5px] bg-fm-surface-frosted/20 transition-all duration-200 focus-within:border-fm-divider-contrast',
					icon: cn('transition-all duration-200', {
						'opacity-100': query.length > 0,
					}),
				}}
				className="relative"
				placeholder="Add people to share access"
				value={query}
				onValueChange={handleValueChange}
				autoComplete="off"
			/>
			<If condition={query.length > 0}>
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
					query.length < 2 && 'hidden',
					'absolute top-13 right-0 left-0 z-50'
				)}
			>
				<ScrollArea
					classes={{
						viewport: 'h-51',
					}}
				>
					<CommandList className="bg-fm-surface-primary max-h-none shadow-lg">
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
										<div
											ref={parentRef}
											className="h-51 overflow-auto"
											style={{
												height: '204px', // h-51 = 204px
												width: '100%',
											}}
										>
											<div
												style={{
													height: `${virtualizer.getTotalSize()}px`,
													width: '100%',
													position: 'relative',
												}}
											>
												<If condition={users?.length === 0}>
													<div className="text-fm-primary h-full p-3 text-sm">
														No user found
													</div>
												</If>
												{virtualizer.getVirtualItems().map((virtualItem) => {
													const user = users[virtualItem.index]
													return (
														<div
															key={virtualItem.key}
															style={{
																position: 'absolute',
																top: 0,
																left: 0,
																width: '100%',
																height: `${virtualItem.size}px`,
																transform: `translateY(${virtualItem.start}px)`,
															}}
														>
															<CommandItem
																onMouseDown={(e) => e.preventDefault()}
																onSelect={() => handleSelect(user)}
																className="p-0"
																classes={{
																	root: 'py-0 px-2',
																}}
															>
																<div
																	className={cn(
																		'flex h-15 w-full flex-col justify-center px-2',
																		{
																			'border-fm-divider-primary border-b border-dashed':
																				virtualItem.index < users.length - 1,
																		}
																	)}
																>
																	<h3 className="text-sm">
																		{user?.fullname ?? 'Anonymous'}
																	</h3>
																	<div className="text-fm-secondary text-xs">
																		{user.email}
																	</div>
																</div>
															</CommandItem>
														</div>
													)
												})}
											</div>
										</div>
									</CommandGroup>
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
