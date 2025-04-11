import { useParams } from 'next/navigation'
import { API_URLS } from '@/constants/global-constants'
import { STORIES_QUERY_KEY } from '@/constants/query-constants'
import useSocket from '@/hooks/use-socket'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'

import { fetchAPI, FetchResponseResult } from '@/lib/fetch-api'

import {
	EFolderType,
	TMessageResponse,
	TUpdateGDriveFolderBody,
	TUpdateGDriveFolderUrlParams,
} from '@/types/admin-types'
import { TMessage } from '@/types/ai-types'
import {
	TPushToGDriveBody,
	TPushToGDriveUrlParams,
} from '@/types/content-types'

import useGDriveAuth from '../query/use-gdrive-auth'

export function useGDriveUpdateMutation() {
	const { id } = useParams()
	const { data } = useSession()
	const queryClient = useQueryClient()

	const onSuccess = async (type: EFolderType) => {
		toast.success('Google Drive-Ordner aktualisiert!')
		if (type === EFolderType.BASE_SCRIPT) {
			await queryClient.invalidateQueries({
				queryKey: [STORIES_QUERY_KEY],
			})
		}
	}

	const onUpdateGDriveFolder = async ({
		drive_folder_url,
		type,
	}: {
		drive_folder_url: string
		type: EFolderType
	}) => {
		const resp = await fetchAPI<
			TMessageResponse,
			TUpdateGDriveFolderUrlParams,
			TUpdateGDriveFolderBody
		>({
			method: 'PATCH',
			url:
				type === EFolderType.BASE_SCRIPT
					? API_URLS.UPDATE_GDRIVE_FOLDER_BASE
					: API_URLS.UPDATE_GDRIVE_FOLDER,
			body: {
				drive_folder_url,
				...(type === EFolderType.BASE_SCRIPT
					? {
							user_id: Number(data?.user?.id),
						}
					: {}),
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
		onSuccess: (_, { type }) => onSuccess(type),
	})

	return mutation
}

export function useGDrivePushMutation() {
	const { id } = useParams()
	const { startTask, getResponse } = useSocket()

	const dict = useTranslations('toasts')
	const { redirectToGDriveAuth } = useGDriveAuth()

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
				noCache: true,
			})

			const resp = await getResponse<FetchResponseResult<TMessage>>(taskId)

			if (resp?.error) {
				toast.info(dict('gdriveAuthPrompt'))
				await redirectToGDriveAuth()
				return
			}
			toast.success(dict('gdriveFolderUpdated'))
			return resp
		} catch (error) {
			console.log(error)
		}
	}

	const mutation = useMutation({
		mutationKey: ['push-to-gdrive'],
		mutationFn: onGDrivePush,
		gcTime: 0,
	})

	return mutation
}
