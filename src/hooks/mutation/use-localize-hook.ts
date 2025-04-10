'use client'

import { useParams } from 'next/navigation'
import { API_URLS, TIdParams } from '@/constants/global-constants'
import { LOC_SHEET_QUERY_KEY } from '@/constants/query-constants'
import useSocket from '@/hooks/use-socket'
import { updateLOCSheet } from '@/server-action/localization-action'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEditorRef } from '@udecode/plate-common/react'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'

import useEpisodeId from '@/providers/episode-id-provider'
import { fetchAPI } from '@/lib/fetch-api'
import { getText } from '@/lib/utils/plate'

import { TLocalizeResponse, TLocalizeUpdateRequest } from '@/types/ai-types'
import { TNoParams } from '@/types/common'

const useLocalizeHook = () => {
	const { id } = useParams()
	const episodeId = useEpisodeId()
	const { children } = useEditorRef()

	const { startTask, getResponse } = useSocket()

	const onLocalize = async () => {
		const taskId = await startTask<{ project_id: string; text: string }>({
			method: 'POST',
			url: API_URLS.STREAM_LOCALIZATION,
			body: {
				text: getText(children),
				project_id: String(id),
			},
			noCache: true,
		})
		const response: TLocalizeResponse['result'] = await getResponse(taskId)
		return response
	}

	const localizeQuery = useQuery({
		queryKey: ['localize', id, episodeId],
		queryFn: onLocalize,
	})
	return localizeQuery
}

export default useLocalizeHook

export const useLocalizeMutation = () => {
	const { id } = useParams()
	const { startTask, getResponse } = useSocket()

	const mutation = useMutation({
		mutationKey: ['localize-update'],
		mutationFn: async (params: TLocalizeUpdateRequest) => {
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
			toast.success(dict('localizationSuccess'))
			await queryClient.invalidateQueries({
				queryKey: [LOC_SHEET_QUERY_KEY, Number(id)],
				exact: true,
			})
		} else {
			toast.success(dict('localizationSync'))
		}
	}

	const onError = () => {
		toast.error(dict('localizationError'))
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
