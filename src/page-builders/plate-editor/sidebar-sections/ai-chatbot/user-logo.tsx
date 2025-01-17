import React from 'react'
import { FALLBACK_USER_URL } from '@/constants/global-constants'
import { useGlobalStore } from '@/store/global-store'
import { useShallow } from 'zustand/react/shallow'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

import { EMessenger, TMessage } from '@/types/ai-types'

export function UserLogo({ message }: { message: TMessage }) {
	const userData = useGlobalStore(useShallow((state) => state.userData))

	if (message.role !== EMessenger.USER) return null

	return (
		<Avatar className="ml-2">
			<AvatarImage
				src={userData?.user?.image || FALLBACK_USER_URL}
				alt="User"
			/>
			<AvatarFallback>U</AvatarFallback>
		</Avatar>
	)
}
