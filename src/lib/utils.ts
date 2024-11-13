import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

import { EStatus } from '@/types/common'
import { TEpisode, TGetEpisodesResponse } from '@/types/episode-type'

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export function getQueryParam(
	url: string | null | undefined,
	paramName: string
): string | undefined {
	try {
		if (!url) return undefined
		const urlObj = new URL(url)
		return urlObj.searchParams.get(paramName) ?? undefined
	} catch (error) {
		console.error('Invalid URL', error)
		return undefined
	}
}

export const getSelectedEpisode = (
	data: TGetEpisodesResponse,
	selectedStatus?: EStatus
): { episode: TEpisode; latestStatus: EStatus } => {
	const prioritizedStatuses = [
		EStatus.PUBLISHED,
		EStatus.POLISH,
		EStatus.SECOND_DRAFT,
		EStatus.FIRST_DRAFT,
	]

	let selectedEpisode: TEpisode | undefined

	if (selectedStatus) {
		selectedEpisode = data.results.data.find(
			(episode) => episode.status === selectedStatus
		)
	}

	if (!selectedEpisode) {
		for (const status of prioritizedStatuses) {
			selectedEpisode = data.results.data.find(
				(episode) => episode.status === status
			)
			if (selectedEpisode) break
		}
	}

	const latestStatus =
		prioritizedStatuses.find((status) =>
			data.results.data.some((episode) => episode.status === status)
		) ?? data.results.data[0].status

	return { episode: selectedEpisode ?? data.results.data[0], latestStatus }
}
