'use client'

import React, { useCallback, useEffect } from 'react'
import useEpisodeContent from '@/hooks/query/use-episode-content'
import { X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'
import {
	ESidebar,
	useEpisodeIdStore as useUCEpisodeIdStore,
	useUnifiedEditorStore,
} from 'unified-editor'

import { Button } from '@/components/aural-ui/button'
import {
	getEpisodeQueryResponseFromStoredData,
	getSavedParamsFromEpisodeData,
} from '@/lib/utils/helpers'
import { getValue, removeValue } from '@/lib/utils/indexed-db'
import {
	breakDownValue,
	isEpisodeContentDifferent,
	jsonify,
} from '@/lib/utils/plate'

import { EDualVIewMode } from '@/types/episode-type'

const useLocalChangesCheck = () => {
	const { data: episodeContent } = useEpisodeContent()
	const dict = useTranslations('placeholders')

	const { setLocalDiffValue, setSidebar } = useUnifiedEditorStore()
	const { setDualViewMode } = useUCEpisodeIdStore()

	const checkForLocalChanges = useCallback(async () => {
		const oldData = await getValue(
			`${episodeContent?.chapter.project}_${episodeContent?.chapter.id}`
		)

		if (!oldData?.text || !episodeContent) {
			return
		}
		const newData = getSavedParamsFromEpisodeData(episodeContent)

		const isContentDifferent = isEpisodeContentDifferent(
			oldData.text,
			newData.text
		)

		if (!isContentDifferent && oldData) {
			void removeValue(
				`${episodeContent?.chapter.project}_${episodeContent?.chapter.id}`
			)
		}

		toast(
			`Episode ${episodeContent?.chapter?.seq_number || ''}: ${dict('contentChanged')}`,
			{
				id: episodeContent?.chapter?.id,
				action: (
					<>
						<Button
							innerClassName="w-30!"
							size="sm"
							onClick={() => {
								setLocalDiffValue(
									breakDownValue(
										jsonify(
											getEpisodeQueryResponseFromStoredData({
												episodeData: episodeContent,
												oldData,
											}).text
										)
									)
								)
								setSidebar(ESidebar.DUAL_VIEW)
								setDualViewMode(EDualVIewMode.LOCAL_DIFF)
								toast.dismiss(episodeContent?.chapter?.id)
							}}
						>
							{dict('localChanges')}
						</Button>
						<X
							className="absolute top-1 right-1 z-10 cursor-pointer"
							onClick={() => toast.dismiss(episodeContent?.chapter?.id)}
							size={12}
						/>
					</>
				),
				duration: Infinity,
			}
		)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [episodeContent])

	useEffect(() => {
		void checkForLocalChanges()
	}, [checkForLocalChanges])
}

export default useLocalChangesCheck
