import { useParams } from 'next/navigation'
import { API_URLS } from '@/constants/global-constants'
import useSocket from '@/hooks/use-socket'
import { useMutation } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'

import { fetchAPI, FetchResponseResult } from '@/lib/fetch-api'

import {
	TMessageResponse,
	TUpdateGDriveFolderBody,
	TUpdateGDriveFolderUrlParams,
} from '@/types/admin-types'
import { TMessage } from '@/types/ai-types'
import {
	TGDriveAuthResponse,
	TGDriveAuthUrlParams,
	TPushToGDriveBody,
	TPushToGDriveUrlParams,
} from '@/types/content-types'

export function useGDriveUpdateMutation() {
	const { id } = useParams()

	const onSuccess = () => {
		toast.success('Google Drive-Ordner aktualisiert!')
	}

	const onUpdateGDriveFolder = async (drive_folder_url: string) => {
		const resp = await fetchAPI<
			TMessageResponse,
			TUpdateGDriveFolderUrlParams,
			TUpdateGDriveFolderBody
		>({
			method: 'PATCH',
			url: API_URLS.UPDATE_GDRIVE_FOLDER,
			body: {
				drive_folder_url,
			},
			urlParams: {
				projectId: String(id),
			},
		})

		return resp.data
	}

	const mutation = useMutation({
		mutationKey: ['update-gdrive-folder'],
		mutationFn: onUpdateGDriveFolder,
		onSuccess,
	})

	return mutation
}

export function useGDrivePushMutation() {
	const { id } = useParams()
	const { data } = useSession()
	const { startTask, getResponse } = useSocket()

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

	async function onGDrivePush(body: TPushToGDriveBody) {
		try {
			const taskId = await startTask<
				TPushToGDriveBody,
				TMessageResponse,
				TPushToGDriveUrlParams
			>({
				method: 'POST',
				url: API_URLS.PUSH_TO_GDRIVE,
				urlParams: {
					projectId: String(id),
				},
				body,
			})

			const resp = await getResponse<FetchResponseResult<TMessage>>(taskId)

			if (resp?.error) {
				toast.info('Wait for google drive authentication, then try again!')
				await redirectToGDriveAuth()
				return
			}

			return resp
		} catch (error) {
			console.log(error)
		}
	}

	const mutation = useMutation({
		mutationKey: ['push-to-gdrive'],
		mutationFn: onGDrivePush,
	})

	return mutation
}
