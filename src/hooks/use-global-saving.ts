import { useCallback, useEffect, useMemo } from 'react'
import { useParams, usePathname } from 'next/navigation'
import useSaving from '@/hooks/use-saving'
import {
	addUnsavedEpisodeParams,
	removeUnsavedEpisodeParams,
} from '@/store/global-store'

import { ELanguage } from '@/types/common'
import { SaveEpisodeParams } from '@/types/episode-type'

// this hook will ensure that every keystroke's content is saved locally
export default function useGlobalSaving() {
	const { id } = useParams()
	const { isSaved, getSavingParams, data } = useSaving()
	const pathname = usePathname()

	const chapterId = useMemo(() => {
		return data?.chapter.parent || data?.chapter.id
	}, [data])

	const handleSaveGlobalStore = useCallback(() => {
		if (!data?.chapter) {
			return
		}
		const { status, text, allComments } = getSavingParams()

		const dataToSave: SaveEpisodeParams = {
			projectId: Number(id),
			status,
			episodeId: Number(chapterId),
			text,
			id: data.chapter.id,
			language: data.chapter.language || ELanguage.GERMAN_ORIGINAL,
			props: {
				...data.chapter.props,
				comments: allComments,
			},
		}

		addUnsavedEpisodeParams(
			`${String(id)}_${String(chapterId)}_${pathname}`,
			dataToSave
		)
	}, [id, data?.chapter, getSavingParams, pathname, chapterId])

	const handleRemoveGlobalStore = useCallback(() => {
		removeUnsavedEpisodeParams(`${String(id)}_${String(chapterId)}_${pathname}`)
	}, [pathname, id, chapterId])

	useEffect(() => {
		if (isSaved) {
			handleRemoveGlobalStore()
		} else {
			handleSaveGlobalStore()
		}
	}, [isSaved, handleRemoveGlobalStore, handleSaveGlobalStore])
}
