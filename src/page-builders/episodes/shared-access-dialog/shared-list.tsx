import React, { useMemo } from 'react'
import { rolesArray } from '@/constants/global-constants'
import useProjectAccessMutation from '@/hooks/mutation/use-project-access-mutation'
import useUserMembersQuery from '@/hooks/query/user-members-data'
import { useProjectUsersTable } from '@/hooks/use-project-users-table'
import ChevronDownIcon from '@/icons/chevron-down-icon'

import { Button } from '@/components/aural-ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/aural-ui/dropdown'
import { ScrollArea } from '@/components/aural-ui/scroll-area'
import { Skeleton } from '@/components/aural-ui/skelton'
import IfElse, { Else, If } from '@/components/if-else'
import { DropdownMenuSeparator } from '@/components/ui/dropdown-menu'

import { EProjectAccessActions, ERole } from '@/types/admin-types'

const ShareListSkeletonLoader = () => (
	<>
		<div className="my-4 flex w-full justify-between">
			<div>
				<Skeleton className="h-4 w-28" />
				<Skeleton className="mt-1 h-4 w-20" />
			</div>
			<Skeleton className="h-8 w-16 rounded-xl" />
		</div>
		<div className="my-4 flex w-full justify-between">
			<div>
				<Skeleton className="h-4 w-24" />
				<Skeleton className="mt-1 h-4 w-20" />
			</div>
			<Skeleton className="h-8 w-16 rounded-xl" />
		</div>
	</>
)

export default function SharedList() {
	const { data, isLoading: isMembersLoading } = useUserMembersQuery()

	const memberData = useMemo(() => data?.members ?? [], [data])
	const { table } = useProjectUsersTable(memberData)
	const projectAccessMutation = useProjectAccessMutation()

	const handleUpdateRole = (email: string, role: ERole) => {
		projectAccessMutation.mutate({
			action: EProjectAccessActions.GRANT,
			body: { user_email: email, role },
		})
	}

	return (
		<ScrollArea className="w-full [&>[data-radix-scroll-area-viewport]]:max-h-36">
			<IfElse condition={isMembersLoading}>
				<If>
					<ShareListSkeletonLoader />
				</If>
				<Else>
					<IfElse condition={table.getRowModel().rows?.length > 0}>
						<If>
							<ul>
								{table.getRowModel().rows.map((row, rowIndex) => (
									<li
										key={rowIndex}
										className="border-fm-divider-secondary font-fm-text flex items-center justify-between border-t-1 border-dashed py-4"
									>
										<div>
											<h3 className="text-sm">
												{row?.original?.user?.fullname ?? 'Anonymous'}
											</h3>
											<span className="text-fm-secondary text-xs">
												{row.original.user.email}
											</span>
										</div>
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button
													variant="outline"
													disabled={row.original.role === ERole.ADMIN}
													size="sm"
													className="gap-2 text-xs"
												>
													{row.original.role}
													<ChevronDownIcon className="h-4 w-4" />
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent>
												<DropdownMenuGroup>
													{rolesArray.map((role, index) => (
														<DropdownMenuItem
															key={index}
															className="!text-xs"
															onClick={() =>
																handleUpdateRole(
																	row.original.user.email,
																	role as ERole
																)
															}
														>
															{role}
															<DropdownMenuSeparator className="border-fm-secondary border-dashed" />
														</DropdownMenuItem>
													))}
												</DropdownMenuGroup>
											</DropdownMenuContent>
										</DropdownMenu>
									</li>
								))}
							</ul>
						</If>
						<Else>
							<h3 className="text-fm-tertiary w-3/4 pt-4">
								No one has access yet. Once you share this project, people will
								appear here
							</h3>
						</Else>
					</IfElse>
				</Else>
			</IfElse>
		</ScrollArea>
	)
}
