import React from 'react'
import { useParams } from 'next/navigation'
import { API_URLS } from '@/constants/global-constants'
import {
	GET_SLACK_CHANNEL_QUERY_KEY,
	UPDATE_SLACK_CHANNEL_MUTATION,
} from '@/constants/query-constants'
import { BubbleCrossedIcon } from '@/icons/bubble-crossed-icon'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'

import { fetchAPI } from '@/lib/fetch-api'

import {
	TGetSlackChannelParams,
	TGetSlackChannelResponse,
	TUpdateSlackChannelBody,
} from '@/types/admin-types'
import { TNoParams } from '@/types/common'

export function useSlackNotificationQuery() {
	const params = useParams()
	const projectId = String(params?.id)
	const defaultData: TGetSlackChannelResponse = {
		bot_is_member: false,
	}
	async function getSlackChannel() {
		const response = await fetchAPI<
			TGetSlackChannelResponse,
			TGetSlackChannelParams
		>({
			method: 'GET',
			url: API_URLS.GET_SLACK_CHANNEL,
			urlParams: {
				projectId,
			},
			defaultData: defaultData,
		})

		return response.data
	}

	const query = useQuery({
		queryKey: [GET_SLACK_CHANNEL_QUERY_KEY, projectId],
		queryFn: getSlackChannel,
		enabled: !!projectId,
	})

	return query
}

export function useSlackNotificationMutation() {
	const params = useParams()
	const projectId = String(params?.id)
	const dict = useTranslations('toasts')

	async function updateSlackChannel(body: TUpdateSlackChannelBody) {
		const response = await fetchAPI<
			TNoParams,
			TGetSlackChannelParams,
			TUpdateSlackChannelBody
		>({
			method: 'PATCH',
			url: API_URLS.UPDATE_SLACK_CHANNEL,
			urlParams: {
				projectId,
			},
			body,
		})

		return response.data
	}

	const onSuccess = () => {
		toast.success(dict('slackSuccess'))
	}

	const onError = () => {
		toast.error(dict('slackError'), {
			icon: <BubbleCrossedIcon />,
		})
	}

	const mutation = useMutation({
		mutationKey: [UPDATE_SLACK_CHANNEL_MUTATION, projectId],
		mutationFn: updateSlackChannel,
		onSuccess,
		onError,
	})

	return mutation
}
