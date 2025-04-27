'ue client'

import { useMemo } from 'react'
import { useParams } from 'next/navigation'
import { USER_LIST_QUERY_KEY } from '@/constants/query-constants'
import useIsInternal from '@/hooks/use-is-internal'
import { getMembers } from '@/server-action/user-action'
import { useQuery } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'

import { ERole } from '@/types/admin-types'

export default function useUserMembersQuery() {
	const { id } = useParams()
	const isInternal = useIsInternal()
	const { data: session } = useSession()

	const query = useQuery({
		queryKey: [USER_LIST_QUERY_KEY, id],
		queryFn: () => getMembers(id as string),
	})

	const data = useMemo(() => {
		if (!session || isInternal || !query.data) return query.data
		const data = query.data

		if (data.members.find((member) => member.user.id === session.user.id))
			return data

		data.members.push({
			role: ERole.ADMIN,
			user: session.user,
		})

		return data
	}, [query.data, isInternal, session])

	return { ...query, data }
}
