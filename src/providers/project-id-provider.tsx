'use client'

import React, { createContext, useMemo } from 'react'
import { AI_USER_ID } from '@/constants/ai-constants'
import { COPILOT_LOGO_URL, DEFAULT_USER } from '@/constants/global-constants'
import userMembersQuery from '@/hooks/query/user-members-data'
import { useGlobalStore } from '@/store/global-store'
import { SuggestionUser } from '@udecode/plate-suggestion'
import { useShallow } from 'zustand/react/shallow'

import { ERole } from '@/types/admin-types'

const useProjectIdUtil = () => {
	const { data } = userMembersQuery()
	const userData = useGlobalStore(useShallow((state) => state.userData))

	const myRole = useMemo(() => {
		if (!userData) return null
		const myUser = data?.members.find(
			(member) => member.user.uid === userData?.uid
		)
		return myUser?.role || ERole.READER
	}, [userData, data])

	const users = useMemo(
		() =>
			data?.members.reduce(
				(prev, curr) => ({
					...prev,
					[curr.user.id]: {
						...curr.user,
						name: curr.user.fullname,
						role: curr.role,
					},
				}),
				{
					[AI_USER_ID]: {
						id: AI_USER_ID,
						name: 'Copilot AI',
						avatarUrl: COPILOT_LOGO_URL,
					},
				} as Record<string, SuggestionUser>
			),
		[data]
	)

	return {
		members: data?.members ?? [],
		me: { user: userData, role: myRole },
		users: {
			...users,
			...DEFAULT_USER,
		},
	}
}

const ProjectIdContext = createContext<ReturnType<
	typeof useProjectIdUtil
> | null>(null)

export const ProjectIdProvider = ({
	children,
}: {
	children: React.ReactNode
}) => {
	const value = useProjectIdUtil()
	return (
		<ProjectIdContext.Provider value={value}>
			{children}
		</ProjectIdContext.Provider>
	)
}

const useProjectId = () => {
	const context = React.useContext(ProjectIdContext)
	if (!context) {
		throw new Error('useProjectId must be used within a ProjectIdProvider')
	}
	return context
}

export default useProjectId
