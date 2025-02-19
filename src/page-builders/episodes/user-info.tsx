import React from 'react'
import { UNASSIGNED_LABEL } from '@/constants/episodes-constants'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { trim } from '@/lib/utils/helpers'

import { UserData } from '@/types/admin-types'

export default function UserInfo({ user }: { user?: UserData }) {
	if (!user) {
		return UNASSIGNED_LABEL
	}

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
