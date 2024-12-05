'use client'

import React from 'react'
import { SuggestionUser } from '@udecode/plate-suggestion'

import { Avatar, AvatarFallback, AvatarImage } from './avatar'

export function SuggestionAvatar({ user }: { user: SuggestionUser | null }) {
	if (!user) return null

	return (
		<Avatar className="size-5">
			<AvatarImage alt={user.name} src={user.avatarUrl} />
			<AvatarFallback>{user.name?.[0]}</AvatarFallback>
		</Avatar>
	)
}
