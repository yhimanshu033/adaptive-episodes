import { useCallback, useEffect } from 'react'
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

	const handleUnsaved = useCallback(
		async (force?: boolean) => {
			const savedKeyPromises = Object.keys(unsavedEpisodeParams).map(
				async (key) => {
					const unsavedPathname = key.split('_')[1]
					if (unsavedPathname === pathname && !force) return
					const params = unsavedEpisodeParams[key]
					if (!params) return
					await saveContent(params)
					return key
				}
			)
			const savedKeys = await Promise.all(savedKeyPromises)
			savedKeys.forEach((key) => key && removeUnsavedEpisodeParams(key))
		},
		[unsavedEpisodeParams, pathname]
	)

	useEffect(() => {
		void handleUnsaved()
	}, [handleUnsaved, pathname])

	return { handleUnsaved }
}
