'use client'

import React, { createContext, useCallback, useMemo } from 'react'
import { usePathname } from 'next/navigation'
import { NWM_EMAIL } from '@/constants/global-constants'
import { EPISODE_CONTENT_QUERY_KEY } from '@/constants/query-constants'
import useLatestEpisodeInfo from '@/hooks/query/use-latest-episode-info'
import { getEpisodeContent } from '@/server-action/content-action'
import useEpisodeIdStore from '@/store/episode-id-store'
import useEditorExtendedStore from '@/store/extended-store'
import { useGlobalStore } from '@/store/global-store'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useShallow } from 'zustand/react/shallow'

import useEpisodeId from '@/providers/episode-id-provider'
import { LOCAL_STORAGE_KEYS } from '@/lib/utils/analytics'
import {
	getAvailableLanguages,
	getDisabledAvailableLanguages,
	getSelectedEpisode,
	getSelectedEpisodeFromLanguage,
} from '@/lib/utils/helpers'

import { BASE_STATUS, ELanguage } from '@/types/common'

import useAccessChecks from '../use-access-checks'

/**
 * Retrieves episode content.
 *
 * @param   selectedStatus?  Optional selected version of the episode.
 *                           Defaults to the latest version if not provided.
 * @returns                  The content of the specified or latest episode version.
 */

export const useEpisodeContentUtil = () => {
	const { store: useEpisodeIdStoreContext } = useEpisodeIdStore()
	const { isOriginal, isOriginalEp } = useAccessChecks()
	const pathName = usePathname()

	const selectedStatus = useEpisodeIdStoreContext(
		useShallow((state) => state.selectedStatus)
	)
	const userData = useGlobalStore(useShallow((state) => state.userData))

	const selectedLanguage = useEpisodeIdStoreContext(
		useShallow((state) => state.selectedLanguage)
	)

	const { addEpisodeMap, addEpisodeKey } = useEditorExtendedStore()
	const { data } = useLatestEpisodeInfo({
		isOriginal,
	})

	const episodeId = useEpisodeId()

	const { episode, language, latestStatus } = useMemo(() => {
		if (!data?.results?.data?.length) {
			return {
				episode: undefined,
				language: ELanguage.GERMAN_ORIGINAL,
				latestStatus: undefined,
			}
		}
		const isGerman = data.results.data.some(
			(ep) => ep.language === ELanguage.GERMAN_ORIGINAL
		)
		// IS CURRENTLY SELECTED LANGUAGE ADAPTED
		const isLanguageNotAdapted =
			!selectedLanguage || isOriginalEp(selectedLanguage)
		// ONLY GERMAN AND NON-ADAPTED CHAPTERS OF ORIGINAL USE STATUSES
		const needStatusEp = isGerman || (isOriginal && isLanguageNotAdapted)
		if (needStatusEp) {
			return getSelectedEpisode(data, selectedStatus)
		}
		return getSelectedEpisodeFromLanguage(data, selectedLanguage)
	}, [data, selectedLanguage, selectedStatus, isOriginal, isOriginalEp])

	const languages = useMemo(() => getAvailableLanguages(data), [data])
	const disabledLanguages = useMemo(
		() => getDisabledAvailableLanguages(data),
		[data]
	)

	const { setRecentEmail } = useEpisodeIdStore()

	const queryKey = useMemo(
		() => [
			EPISODE_CONTENT_QUERY_KEY,
			Number(episode?.id),
			latestStatus || BASE_STATUS,
			pathName,
		],
		[latestStatus, pathName, episode?.id]
	)
	const fetchEpisodeContent = useCallback(async () => {
		// check for undefined episode.id
		if (!episode?.id) {
			return null
		}
		const usedEpisodeId = episode?.id

		const resp = await getEpisodeContent(usedEpisodeId)

		if (!resp?.chapter) {
			return resp
		}

		addEpisodeMap(episodeId, resp)
		addEpisodeKey(episodeId, queryKey)

		localStorage.setItem(
			LOCAL_STORAGE_KEYS.CONTENT_LANGUAGE,
			resp.chapter.language || ELanguage.ENGLISH
		)
		const nwmRunning = resp?.chapter?.props?.nwm_running

		if (nwmRunning) {
			toast.info('Published! This episode is locked for now!')
			setRecentEmail(NWM_EMAIL)
		} else if (resp.email) {
			if (resp.email !== userData?.user?.email) {
				toast.info(
					`${resp.email} is now editing the chapter ${resp.chapter.seq_number}!`
				)
			}
			setRecentEmail(resp.email)
		}

		return resp
	}, [
		addEpisodeKey,
		addEpisodeMap,
		episodeId,
		queryKey,
		setRecentEmail,
		episode,
		userData,
	])

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
		episode,
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
