import { useParams } from 'next/navigation'
import { API_URLS, TIdParams } from '@/constants/global-constants'
import { EPISODE_LIST_QUERY_KEY } from '@/constants/query-constants'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { fetchAPI } from '@/lib/fetch-api'

import { TUpdateWritersBody } from '@/types/admin-types'
import { TNoParams } from '@/types/common'

export default function useWriterUpdateMutation(id: string) {
	const { id: projectId } = useParams()
	const queryClient = useQueryClient()
	const onSuccess = async () => {
		await queryClient.invalidateQueries({
			queryKey: [EPISODE_LIST_QUERY_KEY, Number(projectId)],
			type: 'all',
		})
	}
	async function updateWriter(user_id: TUpdateWritersBody['user_id']) {
		const resp = await fetchAPI<TNoParams, TIdParams, TUpdateWritersBody>({
			method: 'POST',
			url: API_URLS.UPDATE_WRITER,
			body: {
				user_id,
			},
			urlParams: {
				id,
			},
		})
		return resp.data
	}
	const mutation = useMutation({
		mutationKey: ['writer-update', id],
		mutationFn: updateWriter,
		onSuccess,
	})
	return mutation
}
