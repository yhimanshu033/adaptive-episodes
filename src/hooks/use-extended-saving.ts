import { useRouter } from 'next/navigation'
import { SAVE_EPISODE_BUTTON_ID } from '@/constants/editor-constants'
import useEditorExtendedStore from '@/store/extended-store'
import { useQueryClient } from '@tanstack/react-query'
import { useShallow } from 'zustand/react/shallow'

export default function useExtendedSaving() {
	const { store } = useEditorExtendedStore()
	const extendedEpisodeIds = store(useShallow((state) => state.extended))
	const router = useRouter()
	const queryClient = useQueryClient()

	const handleExitBySaving = async ({
		route,
		invalidate,
	}: {
		invalidate?: unknown[][]
		route?: string
	}) => {
		extendedEpisodeIds.forEach((episodeId) => {
			const saveButtonElement = document.getElementById(
				`${SAVE_EPISODE_BUTTON_ID}-${episodeId}`
			)
			saveButtonElement?.click()
		})
		if (route) {
			router.replace(route)
		}
		if (invalidate) {
			const promises = invalidate.map((keys) =>
				queryClient.invalidateQueries({
					queryKey: keys,
				})
			)
			await Promise.all(promises)
		}
	}

	return { handleExitBySaving }
}
