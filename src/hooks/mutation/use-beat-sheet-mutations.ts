import { API_URLS } from '@/constants/global-constants'
import { BSE_SCENE_UPDATE_MUTATION } from '@/constants/query-constants'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

import { fetchAPI } from '@/lib/fetch-api'

import {
	TSceneUpdateBody,
	TSceneUpdateResponse,
} from '@/types/beatsheet-editor-types'
import { TNoParams } from '@/types/common'

export default function useBeatSheetMutations() {
	async function updateBeatSheetScene(body: TSceneUpdateBody) {
		const resp = await fetchAPI<
			TSceneUpdateResponse,
			TNoParams,
			TSceneUpdateBody
		>({
			method: 'POST',
			url: API_URLS.BEATSHEET_SCENE_UPDATE,
			body,
		})
		if (!resp?.data?.result) {
			toast.error('Scene Update Failed!')
		} else {
			toast.success('Scene Data Updated!')
		}
		return resp?.data?.result
	}

	const sceneUpdateMutation = useMutation({
		mutationFn: updateBeatSheetScene,
		mutationKey: [BSE_SCENE_UPDATE_MUTATION],
	})

	return { sceneUpdateMutation }
}
