'use client'

import React, { createContext, useCallback, useEffect, useMemo } from 'react'
import { useParams } from 'next/navigation'
import { AI_USER_ID } from '@/constants/ai-constants'
import { COPILOT_LOGO_URL, DEFAULT_USER } from '@/constants/global-constants'
import userMembersQuery from '@/hooks/query/user-members-data'
import useParentLanguage from '@/hooks/use-parent-language'
import { useGlobalStore } from '@/store/global-store'
import { SuggestionUser } from '@udecode/plate-suggestion'
import { useShallow } from 'zustand/react/shallow'

import { isAuthorized } from '@/lib/utils/helpers'
import { getOpenedStories, setOpenedStories } from '@/lib/utils/indexed-db'

import { ERole } from '@/types/admin-types'
import { ELanguage } from '@/types/common'

const useProjectIdUtil = () => {
	const { id } = useParams()
	const { data } = userMembersQuery()
	const userData = useGlobalStore(useShallow((state) => state.userData))

	const parentLanguage = useParentLanguage()
	const myRole = useMemo(() => {
		if (!userData) {
			return null
		}
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

	const isAccessible = useCallback(
		(role: ERole) => {
			if (parentLanguage && parentLanguage !== ELanguage.GERMAN_ORIGINAL) {
				return true
			}
			if (!myRole) {
				return false
			}
			return isAuthorized({ requiredRole: role, userRole: myRole })
		},
		[myRole, parentLanguage]
	)

	const isWriter = useMemo(() => {
		return isAccessible(ERole.WRITER)
	}, [isAccessible])

	const isLead = useMemo(() => {
		return isAccessible(ERole.LEAD)
	}, [isAccessible])

	const isAdmin = useMemo(() => {
		return isAccessible(ERole.ADMIN)
	}, [isAccessible])

	async function updateOpenedStories() {
		const openedProjects = (await getOpenedStories()) || []
		const newOpenedProjects = openedProjects
			.filter((val) => val !== Number(id))
			.slice(0, 30)
		newOpenedProjects.unshift(Number(id))

		await setOpenedStories(newOpenedProjects)
	}

	useEffect(() => {
		void updateOpenedStories()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return {
		members: data?.members ?? [],
		me: { user: userData, role: myRole },
		users: {
			...users,
			...DEFAULT_USER,
		},
		isAccessible,
		isWriter,
		isLead,
		isAdmin,
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
