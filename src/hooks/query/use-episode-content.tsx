'use client'

import React, { createContext, useMemo } from 'react'
import { EPISODE_CONTENT_QUERY_KEY } from '@/constants/query-constants'
import useEpisodeInfo from '@/hooks/query/use-episode-info'
import { getEpisodeContent } from '@/server-action/content-action'
import useEpisodeIdStore from '@/store/episode-id-store'
import useEditorExtendedStore from '@/store/extended-store'
import usePlateStore from '@/store/plate-store'
import { useQuery } from '@tanstack/react-query'
import { X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'
import { useShallow } from 'zustand/react/shallow'

import { Button } from '@/components/ui/button'
import useEpisodeId from '@/providers/episode-id-provider'
import {
	getAvailableLanguages,
	getDisabledAvailableLanguages,
	getEpisodeQueryResponseFromStoredData,
	getSavedParamsFromEpisodeData,
	getSelectedEpisode,
	getSelectedEpisodeFromLanguage,
} from '@/lib/utils/helpers'
import { getValue, removeValue } from '@/lib/utils/indexed-db'
import {
	breakDownValue,
	isEpisodeContentDifferent,
	jsonify,
} from '@/lib/utils/plate'

import { BASE_STATUS, ELanguage } from '@/types/common'
import { EDualVIewMode } from '@/types/episode-type'
import { ESidebar } from '@/types/plate-types'

/**
 * Retrieves episode content.
 *
 * @param   selectedStatus?  Optional selected version of the episode.
 *                           Defaults to the latest version if not provided.
 * @returns                  The content of the specified or latest episode version.
 */

export const useEpisodeContentUtil = () => {
	const { store: useEpisodeIdStoreContext } = useEpisodeIdStore()

	const selectedStatus = useEpisodeIdStoreContext(
		useShallow((state) => state.selectedStatus)
	)

	const selectedLanguage = useEpisodeIdStoreContext(
		useShallow((state) => state.selectedLanguage)
	)

	const importedLocal = useEpisodeIdStoreContext(
		useShallow((state) => state.importedLocal)
	)
	const { addEpisodeMap, addEpisodeKey } = useEditorExtendedStore()
	const { data } = useEpisodeInfo()

	const episodeId = useEpisodeId()

	const { episode, language, latestStatus } = useMemo(() => {
		if (!data) {
			return {
				episode: undefined,
				language: ELanguage.GERMAN_ORIGINAL,
				latestStatus: undefined,
			}
		}
		const isGerman = data.results.data.some(
			(ep) => ep.language === ELanguage.GERMAN_ORIGINAL
		)
		if (isGerman) {
			return getSelectedEpisode(data, selectedStatus)
		}
		return getSelectedEpisodeFromLanguage(data, selectedLanguage)
	}, [data, selectedLanguage, selectedStatus])

	const dict = useTranslations('placeholders')
	const languages = useMemo(() => getAvailableLanguages(data), [data])
	const disabledLanguages = useMemo(
		() => getDisabledAvailableLanguages(data),
		[data]
	)

	const { setLocalDiffValue, setSidebar } = usePlateStore()
	const { setDualViewMode } = useEpisodeIdStore()

	const usedEpisodeId = useMemo(
		() => (episode ? episode.id : episodeId),
		[episode, episodeId]
	)

	const queryKey = useMemo(
		() => [
			EPISODE_CONTENT_QUERY_KEY,
			usedEpisodeId,
			latestStatus || BASE_STATUS,
			importedLocal,
		],
		[importedLocal, latestStatus, usedEpisodeId]
	)

	async function fetchEpisodeContent() {
		const resp = await getEpisodeContent(usedEpisodeId)
		if (!resp) {
			return resp
		}

		addEpisodeMap(episodeId, resp)
		addEpisodeKey(episodeId, queryKey)

		const oldData = await getValue(`${resp.chapter.project}_${usedEpisodeId}`)
		if (!oldData) {
			return resp
		}
		if (importedLocal) {
			setLocalDiffValue(null)
			setSidebar(null)
			return getEpisodeQueryResponseFromStoredData({
				episodeData: resp,
				oldData,
			})
		}
		const newData = getSavedParamsFromEpisodeData(resp)
		const isContentDifferent = isEpisodeContentDifferent(
			oldData.text,
			newData.text
		)
		if (!isContentDifferent) {
			void removeValue(`${resp.chapter.project}_${usedEpisodeId}`)
			return resp
		}
		toast(
			`Episode ${resp?.chapter?.seq_number || ''}: ${dict('contentChanged')}`,
			{
				id: episodeId,
				action: (
					<>
						<Button
							onClick={() => {
								setLocalDiffValue(
									breakDownValue(
										jsonify(
											getEpisodeQueryResponseFromStoredData({
												episodeData: resp,
												oldData,
											}).text
										)
									)
								)
								setSidebar(ESidebar.DUAL_VIEW)
								setDualViewMode(EDualVIewMode.LOCAL_DIFF)
								toast.dismiss(episodeId)
							}}
						>
							{dict('localChanges')}
						</Button>
						<X
							className="absolute right-1 top-1 z-10 cursor-pointer"
							onClick={() => toast.dismiss(episodeId)}
							size={12}
						/>
					</>
				),
				duration: Infinity,
			}
		)
		return resp
	}

	const query = useQuery({
		queryKey,
		queryFn: fetchEpisodeContent,
		refetchOnMount: false,
		refetchOnReconnect: false,
		refetchOnWindowFocus: false,
		enabled: !!episode,
		staleTime: 0,
		gcTime: 0,
	})
	return {
		...query,
		latestStatus,
		languages,
		disabledLanguages,
		language,
		queryKey,
		importedLocal,
	}
}

const EpisodeContentContext = createContext<ReturnType<
	typeof useEpisodeContentUtil
> | null>(null)

export function EpisodeContentProvider({
	children,
}: {
	children: React.ReactNode
}) {
	const value = useEpisodeContentUtil()
	return (
		<EpisodeContentContext.Provider value={value}>
			{children}
		</EpisodeContentContext.Provider>
	)
}

function useEpisodeContent() {
	const context = React.useContext(EpisodeContentContext)
	if (!context) {
		throw new Error(
			'useEpisodeContent must be used within a EpisodeContentProvider'
		)
	}
	return context
}

export default useEpisodeContent
