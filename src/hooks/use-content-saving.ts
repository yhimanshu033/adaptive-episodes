import { useParams } from 'next/navigation'
import { SAVE_EPISODE_BUTTON_ID } from '@/constants/editor-constants'
// import useEditorExtendedStore from '@/store/extended-store'
import { useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'nextjs-toploader/app'

// import { useShallow } from 'zustand/react/shallow'

export default function useContentSaving() {
	// const { store } = useEditorExtendedStore()
	// const extendedEpisodeIds = store(useShallow((state) => state.extended))
	const router = useRouter()
	const queryClient = useQueryClient()
	const { episodeId } = useParams()

	const handleExitBySaving = async ({
		route,
		invalidate,
	}: {
		invalidate?: unknown[][]
		route?: string
	}) => {
		const saveButtonElement = document.getElementById(
			`${SAVE_EPISODE_BUTTON_ID}-${Number(episodeId)}`
		)
		saveButtonElement?.click()
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
