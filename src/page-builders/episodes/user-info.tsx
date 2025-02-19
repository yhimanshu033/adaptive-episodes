import React from 'react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { trim } from '@/lib/utils/helpers'

import { UserData } from '@/types/admin-types'

export default function UserInfo({ user }: { user: UserData }) {
	return (
		<div className="flex items-center gap-2">
			<Avatar className="size-5">
				{user.image && <AvatarImage alt={user.fullname} src={user.image} />}
				<AvatarFallback className="text-xs" colorString={user.fullname}>
					{user.fullname?.charAt(0)}
				</AvatarFallback>
			</Avatar>
			<p className="text-sm">{trim(user.fullname, 12)}</p>
		</div>
	)
}
