'use client'

import React from 'react'
import { useParams } from 'next/navigation'
import {
	ALL_USERS_QUERY_KEY,
	PROJECT_ACCESS_MUTATION,
	USER_LIST_QUERY_KEY,
} from '@/constants/query-constants'
import { projectAccessMessages } from '@/constants/user-constants'
import { BubbleCrossedIcon } from '@/icons/bubble-crossed-icon'
import { updateProjectAccess } from '@/server-action/user-action'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'

import { EProjectAccessActions, TProjectAccessBody } from '@/types/admin-types'

const useProjectAccessMutation = () => {
	const { id } = useParams()
	const { data } = useSession()
	const queryClient = useQueryClient()

	const dict1 = useTranslations('placeholders')
	const dict2 = useTranslations('toasts')

	const onSuccess = async (
		action: EProjectAccessActions,
		user_email: string
	) => {
		toast.success(dict2(projectAccessMessages[action]), {
			description: user_email,
		})
		await queryClient.invalidateQueries({
			queryKey: [ALL_USERS_QUERY_KEY],
		})
		await queryClient.invalidateQueries({
			queryKey: [USER_LIST_QUERY_KEY, id],
			exact: true,
		})
	}

	const onProjectAccessMutation = ({
		action,
		body,
	}: {
		action: EProjectAccessActions
		body: TProjectAccessBody
	}) => {
		return updateProjectAccess(action, Number(id), Number(data?.user.id), body)
	}

	const projectAccessMutation = useMutation({
		mutationKey: [PROJECT_ACCESS_MUTATION],
		mutationFn: onProjectAccessMutation,
		onSuccess: (_, { action, body: { user_email } }) =>
			onSuccess(action, user_email),
		onError: () =>
			toast.error(dict1('somethingWentWrong'), {
				icon: <BubbleCrossedIcon />,
			}),
	})

	return projectAccessMutation
}

export default useProjectAccessMutation
