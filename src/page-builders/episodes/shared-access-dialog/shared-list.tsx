import React, { useMemo } from 'react'
import { rolesArray } from '@/constants/global-constants'
import useProjectAccessMutation from '@/hooks/mutation/use-project-access-mutation'
import useUserMembersQuery from '@/hooks/query/user-members-data'
import { useProjectUsersTable } from '@/hooks/use-project-users-table'
import ChevronDownIcon from '@/icons/chevron-down-icon'
import { TickIcon } from '@/icons/tick-icon'

import { Button } from '@/components/aural-ui/button'
import { Divider } from '@/components/aural-ui/divider'
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
import { cn } from '@/lib/aural-ui/utils'

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
		<ScrollArea className="w-full px-8 [&>[data-radix-scroll-area-viewport]]:max-h-36">
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
										className={cn(
											'border-fm-divider-secondary font-fm-text flex items-center justify-between border-t-1 border-dashed py-4',
											{
												'border-t-0': rowIndex === 0,
											}
										)}
									>
										<div>
											<h3 className="text-sm">
												{row?.original?.user?.fullname ?? 'Anonymous'}
											</h3>
											<span className="text-fm-secondary text-xs">
												{row.original.user.email}
											</span>
										</div>
										<IfElse condition={row.original.role === ERole.ADMIN}>
											<If>
												<span className="mr-2 text-xs uppercase">
													{row.original.role}
												</span>
											</If>
											<Else>
												<DropdownMenu>
													<DropdownMenuTrigger asChild>
														<Button
															variant="outline"
															size="sm"
															className="group gap-2 text-xs"
														>
															{row.original.role}
															<ChevronDownIcon className="h-4 w-4 transition-all duration-300 group-data-[state=open]:!rotate-180" />
														</Button>
													</DropdownMenuTrigger>
													<DropdownMenuContent align="end">
														<DropdownMenuGroup>
															{rolesArray.map((role, index) => (
																<div key={`user-role-${index}`}>
																	<DropdownMenuItem
																		className="!text-xs"
																		onClick={() =>
																			handleUpdateRole(
																				row.original.user.email,
																				role as ERole
																			)
																		}
																	>
																		<div className="flex w-full items-center justify-between">
																			{role}
																			<If
																				condition={role === row.original.role}
																			>
																				<TickIcon className="size-4" />
																			</If>
																		</div>
																	</DropdownMenuItem>
																	<If condition={index < rolesArray.length - 1}>
																		<div className="px-2">
																			<Divider variant="dashed" />
																		</div>
																	</If>
																</div>
															))}
														</DropdownMenuGroup>
													</DropdownMenuContent>
												</DropdownMenu>
											</Else>
										</IfElse>
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
