import { useCallback, useEffect } from 'react'
import { useParams, usePathname } from 'next/navigation'
import useSaving from '@/hooks/use-saving'
import {
	addUnsavedEpisodeParams,
	removeUnsavedEpisodeParams,
} from '@/store/global-store'

import { BASE_STATUS, ELanguage, EStatus } from '@/types/common'
import { SaveEpisodeParams } from '@/types/episode-type'

// this hook will ensure that every keystroke's content is saved locally
export default function useGlobalSaving() {
	const { id } = useParams()
	const { isSaved, getSavingParams, data } = useSaving()
	const pathname = usePathname()

	const handleSaveGlobalStore = useCallback(() => {
		if (!data?.chapter) {
			return
		}
		const { status, text, chapterId, allComments, title } = getSavingParams()

		const dataToSave: SaveEpisodeParams = {
			projectId: Number(id),
			status:
				!data?.chapter.language ||
				data?.chapter.language === ELanguage.GERMAN_ORIGINAL
					? status === BASE_STATUS
						? EStatus.FIRST_DRAFT
						: status
					: BASE_STATUS,
			episodeId: Number(data?.chapter.parent || chapterId),
			text,
			id: Number(chapterId),
			language: data?.chapter.language || ELanguage.GERMAN_ORIGINAL,
			props: {
				...data?.chapter.props,
				comments: allComments,
			},
			chapter_title: title || data?.chapter.chapter_title,
		}

		addUnsavedEpisodeParams(
			`${String(id)}_${String(chapterId)}_${pathname}`,
			dataToSave
		)
	}, [id, data?.chapter, getSavingParams, pathname])

	const handleRemoveGlobalStore = useCallback(() => {
		if (!data?.chapter) {
			return
		}
		const chapterId = data?.chapter.parent
		removeUnsavedEpisodeParams(`${String(id)}_${String(chapterId)}_${pathname}`)
	}, [data?.chapter, pathname, id])

	useEffect(() => {
		if (isSaved) {
			handleRemoveGlobalStore()
		} else {
			handleSaveGlobalStore()
		}
	}, [isSaved, handleRemoveGlobalStore, handleSaveGlobalStore])
}
