import React from 'react'
import { UNASSIGNED_LABEL } from '@/constants/episodes-constants'
import { toast } from 'sonner'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { trim } from '@/lib/utils/helpers'

import { UserData } from '@/types/admin-types'

export default function UserInfo({
	user,
	showFullName,
	showEmail,
}: {
	showEmail?: boolean
	showFullName?: boolean
	user?: UserData
}) {
	const handleEmailCopy = (
		e: React.MouseEvent<HTMLParagraphElement, MouseEvent>,
		email: string
	) => {
		e.stopPropagation()
		void navigator.clipboard.writeText(email)
		toast.success('E-Mail kopiert!')
	}

	if (!user) {
		return UNASSIGNED_LABEL
	}

	return (
		<div className="flex w-full items-center justify-between">
			<div className="flex items-center gap-2">
				<Avatar className="size-5">
					{user.image && <AvatarImage alt={user.fullname} src={user.image} />}
					<AvatarFallback className="text-xs" colorString={user.fullname}>
						{user.fullname?.charAt(0)}
					</AvatarFallback>
				</Avatar>
				<p className="text-sm">
					{showFullName ? user.fullname : trim(user.fullname, 12)}
				</p>
			</div>
			{showEmail && (
				<p
					onClick={(e) => handleEmailCopy(e, user.email)}
					className="text-sm text-muted-foreground transition-transform hover:scale-95"
				>
					{user.email}
				</p>
			)}
		</div>
	)
}
