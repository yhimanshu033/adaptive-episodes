'use client'

import React from 'react'
import useAuth from '@/hooks/use-auth'
import UserInfoSkeleton from '@/page-builders/settings/user-skeleton'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export function UserInfo() {
	const { session } = useAuth()
	const user = session?.data?.user

	if (!user?.fullname) {
		return <UserInfoSkeleton />
	}
	return (
		<div className="bg-background-editor flex items-center space-x-4 rounded-lg p-4">
			<Avatar className="size-20">
				{user.image && <AvatarImage src={user.image} alt={user.fullname} />}
				<AvatarFallback colorString={user.fullname} className="text-white">
					{user.fullname.charAt(0)}
				</AvatarFallback>
			</Avatar>
			<div>
				<h2 className="text-xl font-semibold">{user.fullname}</h2>
				<p className="text-muted-foreground">{user.email}</p>
			</div>
		</div>
	)
}
