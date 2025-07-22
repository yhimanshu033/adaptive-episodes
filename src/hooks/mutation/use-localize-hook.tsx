'use client'

import React from 'react'
import { useParams } from 'next/navigation'
import { API_URLS, TIdParams } from '@/constants/global-constants'
import { LOC_SHEET_QUERY_KEY } from '@/constants/query-constants'
import useIsGerman from '@/hooks/use-is-german'
import useSocket from '@/hooks/use-socket'
import { BubbleCheckIcon } from '@/icons/bubble-check-icon'
import { BubbleCrossedIcon } from '@/icons/bubble-crossed-icon'
import { updateLOCSheet } from '@/server-action/localization-action'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'

import { fetchAPI } from '@/lib/fetch-api'

import {
	TLocalizeBody,
	TLocalizeResponse,
	TLocalizeUpdateRequest,
} from '@/types/ai-types'
import { ELanguage, TNoParams } from '@/types/common'

const useLocalizeHook = ({
	text,
	episodeId,
	language,
}: {
	episodeId: number
	language?: ELanguage
	text: string
}) => {
	const { id } = useParams()

	const { startTask, getResponse } = useSocket()
	const isGerman = useIsGerman()

	const onLocalize = async () => {
		const defaultData: TLocalizeResponse['result'] = {
			characters: {},
			concepts: {},
			objects: {},
			places: {},
		}
		if (!isGerman) {
			return defaultData
		}
		const taskId = await startTask<TLocalizeBody>({
			method: 'POST',
			url: API_URLS.STREAM_LOCALIZATION,
			body: {
				text,
				project_id: String(id),
				input_language: language,
			},
			noCache: true,
		})
		const response: TLocalizeResponse['result'] = await getResponse(taskId)
		return response
	}

	const localizeQuery = useQuery({
		queryKey: ['localize', id, episodeId],
		queryFn: onLocalize,
		enabled: !!text,
	})
	return localizeQuery
}

export default useLocalizeHook

export const useLocalizeMutation = () => {
	const { id } = useParams()
	const { startTask, getResponse } = useSocket()
	const isGerman = useIsGerman()

	const mutation = useMutation({
		mutationKey: ['localize-update'],
		mutationFn: async (params: TLocalizeUpdateRequest) => {
			if (!isGerman) {
				return
			}
			const taskId = await startTask<
				TLocalizeUpdateRequest,
				TNoParams,
				TIdParams
			>({
				method: 'PATCH',
				url: API_URLS.LOCALIZATION_UPDATE,
				body: params,
				urlParams: { id: String(id) },
			})

			const response = await getResponse(taskId)

			return response
		},
	})

	return mutation
}

export const useLocalizeDownloadMutation = () => {
	const { id } = useParams()

	const mutation = useMutation({
		mutationKey: ['localize-sheet-download'],
		mutationFn: async () => {
			const res = await fetchAPI<{ csv_sheet_url: string }, TIdParams>({
				method: 'GET',
				url: API_URLS.LOCALIZATION_GET,
				urlParams: { id: String(id) },
			})
			return res.data
		},
	})

	return mutation
}

export const useUpdateLOCSheetMutation = () => {
	const { id } = useParams()
	const session = useSession()
	const { startTask, getResponse } = useSocket()
	const queryClient = useQueryClient()

	const dict = useTranslations('toasts')

	const onSuccess = async (url?: string) => {
		if (url) {
			toast.success(dict('localizationSuccess'), {
				icon: <BubbleCheckIcon />,
			})
			await queryClient.invalidateQueries({
				queryKey: [LOC_SHEET_QUERY_KEY, Number(id)],
				exact: true,
			})
		} else {
			toast.success(dict('localizationSync'), {
				icon: <BubbleCheckIcon />,
			})
		}
	}

	const onError = () => {
		toast.error(dict('localizationError'), {
			icon: <BubbleCrossedIcon />,
		})
	}

	const onUpdateLOCSheet = async (url?: string) => {
		if (url) {
			await updateLOCSheet(Number(id), {
				loc_sheet_url: url,
				user_id: session.data?.user.id || 0,
			})
		}
		const taskId = await startTask({
			method: 'POST',
			url: API_URLS.UPDATE_LOC_MAPPING,
			urlParams: {
				projectId: Number(id),
			},
			noCache: true,
		})
		const resp = await getResponse(taskId)
		return resp
	}

	const mutation = useMutation({
		mutationKey: ['update-loc-sheet'],
		mutationFn: onUpdateLOCSheet,
		onSuccess: (_, url) => onSuccess(url),
		onError,
	})

	return mutation
}
