import React, { ReactNode, useState } from 'react'
import useAuth from '@/hooks/use-auth'
import useIsInternal from '@/hooks/use-is-internal'
import useUnsavedChecker from '@/hooks/use-unsaved-checker'
import { ArrowBoxLeftIcon } from '@/icons/arrow-box-left-icon'
import { MaintenanceIcon } from '@/icons/maintenance-icon'
import useEditPromptsStore from '@/store/prompt-editor-store'
import { signOut } from 'next-auth/react'

import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from '@/components/aural-ui/avatar'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/aural-ui/dropdown'
import { If } from '@/components/aural-ui/if-else'
import { Typography } from '@/components/aural-ui/typography'

type IUserProfileDropDownProps = {
	children: ReactNode
}

const UserProfileDropDown = ({ children }: IUserProfileDropDownProps) => {
	const { session } = useAuth()
	const isInternal = useIsInternal()
	const { setFormOpen } = useEditPromptsStore()
	const [isLoading, setIsLoading] = useState(false)
	const user = session?.data?.user
	const fallbackInitial = user?.fullname?.charAt(0) ?? '?'

	const onLogout = async (e: React.MouseEvent) => {
		e.stopPropagation()
		setIsLoading(true)
		try {
			await signOut()
		} catch (error) {
			console.error({ error })
		} finally {
			setIsLoading(false)
		}
	}

	const onEditPrompts = () => {
		setFormOpen(true)
	}

	console.log(isLoading)
	useUnsavedChecker()
	// Need clarity on using the above on Log-out
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
			<DropdownMenuContent align="end" sideOffset={4}>
				<DropdownMenuGroup>
					<DropdownMenuItem>
						<div className="flex items-center gap-2">
							<Avatar>
								<AvatarImage src={user?.image || ''} alt="User Image" />
								<AvatarFallback>{fallbackInitial}</AvatarFallback>
							</Avatar>
							<div className="space-y-1">
								<Typography as="div">{user?.fullname}</Typography>
								<Typography as="div">{user?.email}</Typography>
							</div>
						</div>
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<If condition={isInternal}>
						<DropdownMenuItem onClick={onEditPrompts}>
							<MaintenanceIcon /> Edit Prompts
						</DropdownMenuItem>
						<DropdownMenuSeparator />
					</If>
					<DropdownMenuItem onClick={() => void onLogout}>
						<ArrowBoxLeftIcon /> Log Out
					</DropdownMenuItem>
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}

export default UserProfileDropDown
