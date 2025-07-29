'use client'

import React from 'react'

import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from '@/components/aural-ui/avatar'

import { PlateUser } from '@/types/plate-types'

export function SuggestionAvatar({ user }: { user: PlateUser | null }) {
	if (!user) {
		return null
	}

	return (
		<Avatar className="size-8">
			<AvatarImage alt={user?.name} src={user?.avatarUrl} />
			<AvatarFallback>{user?.name?.[0]}</AvatarFallback>
		</Avatar>
	)
}
