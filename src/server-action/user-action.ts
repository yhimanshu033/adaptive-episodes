
import { API_URLS, TIdParams } from '@/constants/global-constants'

import { fetchAPI } from '@/lib/fetch-api'

import {
	EProjectAccessActions,
	TGetAllUsersQueryParams,
	TGetAllUsersResponse,
	TGetMembersResponse,
	TProjectAccessBody,
	TProjectAccessURLParams,
	UserProject,
} from '@/types/admin-types'
import { TNoParams } from '@/types/common'

export const getMembers = async (id: string) => {
	const defaultData = { members: [] }
	const resp = await fetchAPI<TGetMembersResponse, TIdParams>({
		method: 'GET',
		url: API_URLS.MEMBERS_GET,
		defaultData,
		urlParams: {
			id,
		},
	})
	return resp.data
}

export const getUserProjects = async () => {
	const resp = await fetchAPI<{ projects: UserProject[] }>({
		method: 'GET',
		url: API_URLS.GET_USER_PROJECTS,
	})
	return resp.data?.projects ?? []
}

export const getAllUsers = async (query: string) => {
	const resp = await fetchAPI<
		TGetAllUsersResponse,
		TNoParams,
		TNoParams,
		TGetAllUsersQueryParams
	>({
		method: 'GET',
		url: API_URLS.GET_ALL_USERS,
		query: {
			q: query,
		},
	})
	return resp.data?.data ?? []
}

export const updateProjectAccess = async (
	action: EProjectAccessActions,
	projectId: number,
	userId: number,
	params: TProjectAccessBody
) => {
	const resp = await fetchAPI<
		{ message: string },
		TProjectAccessURLParams,
		TProjectAccessBody
	>({
		method: 'POST',
		url:
			action === EProjectAccessActions.GRANT
				? API_URLS.GIVE_PROJECT_ACCESS
				: API_URLS.REVOKE_PROJECT_ACCESS,
		body: params,
		urlParams: {
			projectId,
			userId,
		},
	})

	if (!resp.success) {
		throw resp.error
	}
	return resp.data
}
