'ue client'

import { useParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'

import { fetchAPI } from '@/lib/fetch-api'

import { TGetMembersResponse } from '@/types/admin-types'

export default function useUserMembersQuery() {
	const { id } = useParams()
	async function getMembers() {
		const resp = await fetchAPI<TGetMembersResponse>({
			method: 'GET',
			url: `/project/${String(id)}/get-project-members`,
			defaultData: { members: [] },
		})

		return resp.data
	}
	const query = useQuery({
		queryKey: ['user-list', id],
		queryFn: getMembers,
	})

	return query
}
