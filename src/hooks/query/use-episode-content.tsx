'use client'

import React, { createContext, useState } from 'react'
import { EPISODE_CONTENT_QUERY_KEY } from '@/constants/episodes-constants'
import useEpisodeInfo from '@/hooks/query/use-episode-info'
import { toast } from '@/hooks/use-toast'
import { getEpisodeContent } from '@/server-action/content-action'
import useEpisodeIdStore from '@/store/episode-id-store'
import useEditorExtendedStore from '@/store/extended-store'
import usePlateStore from '@/store/plate-store'
import { useQuery } from '@tanstack/react-query'
import { useShallow } from 'zustand/react/shallow'

import { Button } from '@/components/ui/button'
import useEpisodeId from '@/providers/episode-id-provider'
import {
	getEpisodeQueryResponseFromStoredData,
	getSavedParamsFromEpisodeData,
	getSelectedEpisode,
} from '@/lib/utils/helpers'
import { getValue } from '@/lib/utils/indexed-db'
import {
	breakDownValue,
	isEpisodeContentDifferent,
	jsonify,
} from '@/lib/utils/plate'

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
	const { addEpisodeMap } = useEditorExtendedStore()
	const { data } = useEpisodeInfo()
	const episodeId = useEpisodeId()
	const { episode, latestStatus } = data
		? getSelectedEpisode(data, selectedStatus)
		: { episode: undefined, latestStatus: undefined }
	const [imported, setImported] = useState(false)

	const { setLocalDiffValue, setSidebar } = usePlateStore()

	const queryKey = [
		EPISODE_CONTENT_QUERY_KEY,
		episode ? episode.id : episodeId,
		latestStatus || 'BASE',
		imported,
	]

	async function fetchEpisodeContent() {
		const resp = await getEpisodeContent(episode?.id || episodeId)
		if (!resp) return resp
		addEpisodeMap(episodeId, resp)
		const chapterId = String(resp.chapter.parent)
		const oldData = await getValue(`${resp.chapter.project}_${chapterId}`)
		if (!oldData) return resp
		if (imported) {
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
		if (!isContentDifferent) return resp
		toast({
			description: `Der Inhalt von Episode ${resp?.chapter?.seq_number || ''} scheint geändert zu sein`,
			action: (
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
						setSidebar(ESidebar.LOCAL_DIFF)
					}}
				>
					Lokal Ansehen
				</Button>
			),
		})
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
	return { ...query, latestStatus, queryKey, setImported, imported }
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
