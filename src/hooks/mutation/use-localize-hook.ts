'use client'

import { useParams } from 'next/navigation'
import useSocket from '@/hooks/use-socket'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useEditorState } from '@udecode/plate-common/react'

import { fetchAPI } from '@/lib/fetch-api'
import { getText } from '@/lib/utils'

import { TLocalizeResponse, TLocalizeUpdateRequest } from '@/types/ai-types'
import { TNoParams } from '@/types/common'

const useLocalizeHook = () => {
	const { id, episodeId } = useParams()
	const { children } = useEditorState()
	const { startTask, getResponse } = useSocket()
	const onLocalize = async () => {
		const taskId = await startTask<{ project_id: string; text: string }>({
			method: 'POST',
			url: '/aicopilot/localize/',
			body: {
				text: getText(children),
				project_id: String(id),
			},
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
	const mutation = useMutation({
		mutationKey: ['localize-update'],
		mutationFn: async (params: TLocalizeUpdateRequest) => {
			const res = await fetchAPI<TNoParams, TNoParams, TLocalizeUpdateRequest>({
				method: 'PATCH',
				url: `/project/${String(id)}/update-ls-mapping/`,
				body: params,
			})
			return res
		},
	})
	return mutation
}
