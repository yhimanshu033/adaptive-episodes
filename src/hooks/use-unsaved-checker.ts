import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { saveContent } from '@/server-action/content-action'
import {
	removeUnsavedEpisodeParams,
	useGlobalStore,
} from '@/store/global-store'
import { useShallow } from 'zustand/react/shallow'

export default function useUnsavedChecker() {
	const unsavedEpisodeParams = useGlobalStore(
		useShallow((state) => state.unsavedEpisodeParams)
	)

	const pathname = usePathname()

	useEffect(() => {
		const savedKeys: string[] = []
		Object.keys(unsavedEpisodeParams).forEach((key) => {
			const unsavedPathname = key.split('_')[1]
			if (unsavedPathname === pathname) return
			const params = unsavedEpisodeParams[key]
			if (!params) return
			//   console.log('Saving unsaved content: ', params) // Uncomment this line for testing
			void saveContent(params)
			savedKeys.push(key)
		})
		savedKeys.forEach((key) => {
			removeUnsavedEpisodeParams(key)
		})
	}, [unsavedEpisodeParams, pathname])
}
