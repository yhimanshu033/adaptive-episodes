'use client'

import React from 'react'
import useAuth from '@/hooks/use-auth'
import UserInfoSkeleton from '@/page-builders/settings/user-skeleton'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export function UserInfo() {
	const { session } = useAuth()
	const user = session?.data?.user

	if (!user?.name) {
		return <UserInfoSkeleton />
	}
	return (
		<div className="flex items-center space-x-4 rounded-lg bg-background-editor p-4">
			<Avatar className="size-20">
				{user.image && <AvatarImage src={user.image} alt={user.name} />}
				<AvatarFallback colorString={user.name}>
					{user.name.charAt(0)}
				</AvatarFallback>
			</Avatar>
			<div>
				<h2 className="text-xl font-semibold">{user.name}</h2>
				<p className="text-muted-foreground">{user.email}</p>
			</div>
		</div>
	)
}
