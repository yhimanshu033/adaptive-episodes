'use client'

import { API_URLS } from '@/constants/global-constants'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'

import { fetchAPI } from '@/lib/fetch-api'

import {
	TGDriveAuthResponse,
	TGDriveAuthUrlParams,
} from '@/types/content-types'

const useGDriveAuth = () => {
	const { data } = useSession()

	async function redirectToGDriveAuth() {
		if (!data?.user.id) {
			toast.error('User not found')
			return
		}
		const resp = await fetchAPI<TGDriveAuthResponse, TGDriveAuthUrlParams>({
			method: 'GET',
			url: API_URLS.GDRIVE_AUTH,
			urlParams: {
				userId: String(data?.user?.id || 1),
			},
		})

		if (!resp.data?.auth_url) return

		window.open(resp.data.auth_url, '_blank')
	}

	return { redirectToGDriveAuth }
}

export default useGDriveAuth
