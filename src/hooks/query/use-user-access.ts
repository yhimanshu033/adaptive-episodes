import { API_URLS } from '@/constants/global-constants'
import { GET_USER_ACCESS } from '@/constants/query-constants'
import {
	OUTLINER_FEATURE_KEY,
	OUTLINER_ONBOARDING_FEATURE_KEY,
} from '@/constants/user-constants'
import { useGlobalStore } from '@/store/global-store'
import { useQuery } from '@tanstack/react-query'
import { useShallow } from 'zustand/react/shallow'

import { fetchAPI } from '@/lib/fetch-api'

import {
	TGetUserFeatureAccessQueryParams,
	TGetUserFeatureAccessResponse,
} from '@/types/admin-types'
import { TNoParams } from '@/types/common'

async function getUserAccess(
	args?: Pick<TGetUserFeatureAccessQueryParams, 'project_id'>
) {
	const features = [OUTLINER_ONBOARDING_FEATURE_KEY]
	if (args?.project_id) {
		features.push(OUTLINER_FEATURE_KEY)
	}
	const resp = await fetchAPI<
		TGetUserFeatureAccessResponse,
		TNoParams,
		TNoParams,
		TGetUserFeatureAccessQueryParams
	>({
		method: 'GET',
		url: API_URLS.GET_USER_FEATURE_ACCESS,
		query: {
			features: features.join(','),
			project_id: args?.project_id,
		},
	})

	return resp?.data?.result
}

export default function useUserAccess(
	args?: Pick<TGetUserFeatureAccessQueryParams, 'project_id'>
) {
	const userData = useGlobalStore(useShallow((state) => state.userData))
	const query = useQuery({
		queryKey: [GET_USER_ACCESS, userData?.user.id, args?.project_id],
		queryFn: () => getUserAccess(args),
		enabled: !!userData?.user.id,
	})

	return query
}
