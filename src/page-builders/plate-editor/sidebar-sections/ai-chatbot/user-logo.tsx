import React from 'react'
import { useGlobalStore } from '@/store/global-store'
import { useShallow } from 'zustand/react/shallow'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

import { EMessenger, TMessage } from '@/types/ai-types'

export function UserLogo({ message }: { message: TMessage }) {
	const userData = useGlobalStore(useShallow((state) => state.userData))

	if (message.role !== EMessenger.USER) return null

	return (
		<Avatar className="ml-2">
			{userData?.user?.image && (
				<AvatarImage src={userData?.user?.image} alt="User" />
			)}
			<AvatarFallback colorString={userData?.user?.fullname || ''}>
				{userData?.user?.fullname?.[0] || 'U'}
			</AvatarFallback>
		</Avatar>
	)
}
