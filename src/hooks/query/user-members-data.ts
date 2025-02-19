'ue client'

import { useParams } from 'next/navigation'
import { API_URLS, TIdParams } from '@/constants/global-constants'
import { useQuery } from '@tanstack/react-query'

import { fetchAPI } from '@/lib/fetch-api'

import { TGetMembersResponse } from '@/types/admin-types'

export default function useUserMembersQuery() {
	const { id } = useParams()
	async function getMembers() {
		const resp = await fetchAPI<TGetMembersResponse, TIdParams>({
			method: 'GET',
			url: API_URLS.MEMBERS_GET,
			defaultData: { members: [] },
			urlParams: {
				id: String(id),
			},
		})

		return resp.data
	}
	const query = useQuery({
		queryKey: ['user-list', id],
		queryFn: getMembers,
	})

	return query
}
