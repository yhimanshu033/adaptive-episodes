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
import usePlateStore from '@/store/plate-store'
import { useQuery } from '@tanstack/react-query'
import { X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'
import { useShallow } from 'zustand/react/shallow'

import { Button } from '@/components/aural-ui/button'
import useEpisodeId from '@/providers/episode-id-provider'
import { LOCAL_STORAGE_KEYS } from '@/lib/utils/analytics'
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

	const dict = useTranslations('placeholders')
	const languages = useMemo(() => getAvailableLanguages(data), [data])
	const disabledLanguages = useMemo(
		() => getDisabledAvailableLanguages(data),
		[data]
	)

	const { setLocalDiffValue, setSidebar } = usePlateStore()
	const { setDualViewMode, setRecentEmail } = useEpisodeIdStore()
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
		if (!resp) {
			return resp
		}

		localStorage.setItem(
			LOCAL_STORAGE_KEYS.CONTENT_LANGUAGE,
			resp.chapter.language || ELanguage.ENGLISH
		)
		const nwmRunning = resp?.chapter?.props?.nwm_running

		addEpisodeMap(episodeId, resp)
		addEpisodeKey(episodeId, queryKey)

		if (nwmRunning) {
			toast.info(
				'NWM is currently regenerating this chapter. Please check back later!'
			)
			setRecentEmail(NWM_EMAIL)
		} else if (resp.email) {
			if (resp.email !== userData?.user?.email) {
				toast.info(`${resp.email} is now editing the chapter!`)
			}
			setRecentEmail(resp.email)
		}

		const oldData = await getValue(`${resp.chapter.project}_${usedEpisodeId}`)
		if (!oldData) {
			return resp
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
							innerClassName="w-30!"
							size="sm"
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
							className="absolute top-1 right-1 z-10 cursor-pointer"
							onClick={() => toast.dismiss(episodeId)}
							size={12}
						/>
					</>
				),
				duration: Infinity,
			}
		)
		return resp
	}, [
		addEpisodeKey,
		addEpisodeMap,
		dict,
		episodeId,
		queryKey,
		setDualViewMode,
		setLocalDiffValue,
		setSidebar,
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
