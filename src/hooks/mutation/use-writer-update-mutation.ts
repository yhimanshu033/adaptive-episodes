import { useMutation } from '@tanstack/react-query'

import { fetchAPI } from '@/lib/fetch-api'

import { TUpdateWritersBody } from '@/types/admin-types'
import { TNoParams } from '@/types/common'

export default function useWriterUpdateMutation(id: string) {
	async function updateWriter(user_id: TUpdateWritersBody['user_id']) {
		const resp = await fetchAPI<TNoParams, TNoParams, TUpdateWritersBody>({
			method: 'POST',
			url: `/chapter/update-writer/${id}/`,
			body: {
				user_id,
			},
		})
		return resp.data
	}
	const mutation = useMutation({
		mutationKey: ['writer-update', id],
		mutationFn: updateWriter,
	})
	return mutation
}
