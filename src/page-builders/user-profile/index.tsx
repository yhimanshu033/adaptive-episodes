'use client'

import React from 'react'
import Link from 'next/link'
import useAuth from '@/hooks/use-auth'
import PromptEditor from '@/page-builders/user-profile/prompt-editor'
import UserProfileDropDown from '@/page-builders/user-profile/user-profile-dropdown'
import { useSession } from 'next-auth/react'

import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from '@/components/aural-ui/avatar'
import { IconButton } from '@/components/aural-ui/icon-button'

export default function UserProfile() {
	const { data } = useSession()
	const { session } = useAuth()
	const user = session?.data?.user
	const fallbackInitial = user?.fullname?.charAt(0) ?? '?'

	if (!data) {
		return <Link href="/auth/signin">Login</Link>
	}

	return (
		<>
			<PromptEditor />
			<UserProfileDropDown>
				<IconButton
					label="Trigger drop down"
					className="size-9 p-2"
					icon={
						<Avatar className="size-7">
							<AvatarImage src={user?.image || ''} alt="User Image" />
							<AvatarFallback>{fallbackInitial}</AvatarFallback>
						</Avatar>
					}
				/>
			</UserProfileDropDown>
		</>
	)
}
