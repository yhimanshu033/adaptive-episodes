'use server'

import { API_URLS } from '@/constants/global-constants'

import { fetchAPI } from '@/lib/fetch-api'

import { ELanguage, TNoParams } from '@/types/common'
import {
	TEpisodeDeleteResponse,
	TEpisodeDeleteURLParams,
	TEpisodeInventParams,
	TEpisodeInventResponse,
	TEpisodeUnmergeParams,
	TEpisodeUnmergeResponse,
	TGetEpisodeDetailsQueryParams,
	TGetEpisodesQueryParams,
	TGetEpisodesResponse,
	TGetNotesResponse,
	TMultiEpisodeDeleteBody,
	TMultiEpisodeDeleteResponse,
	TMultiEpisodeDeleteURLParams,
	TNotesUpdateBody,
	TStatusUpdateBody,
	TStatusUpdateResponse,
	TStatusUpdateURLParams,
} from '@/types/episode-type'

export const getEpisodes = async ({
	project_id,
	page = 1,
	search = '',
	limit,
}: TGetEpisodesQueryParams) => {
	const episodes = await fetchAPI<
		TGetEpisodesResponse,
		TNoParams,
		TNoParams,
		TGetEpisodesQueryParams
	>({
		method: 'GET',
		url: API_URLS.GET_EPISODES,
		query: {
			project_id,
			page,
			search,
			limit,
		},
	})

	return episodes.data
}

export const getEpisodeDetails = async (
	project_id: number,
	parent: number = 1
) => {
	const episodes = await fetchAPI<
		TGetEpisodesResponse,
		TNoParams,
		TNoParams,
		TGetEpisodeDetailsQueryParams
	>({
		method: 'GET',
		url: API_URLS.GET_EPISODES,
		query: {
			project_id,
			parent,
		},
	})

	const sentData = episodes.data
	if (sentData?.results.data) {
		const languageAvailable = sentData?.results.data.find((ep) => !!ep.language)
		if (!languageAvailable) {
			sentData.results.data.forEach(
				(ep) => (ep.language = ELanguage.GERMAN_ORIGINAL)
			)
		}
		const isGerman = sentData?.results.data.find(
			(ep) => ep.language === ELanguage.GERMAN_ORIGINAL
		)

		if (!isGerman) {
			return sentData
		}

		sentData.results.data = sentData?.results.data.filter(
			(ep) => ep.language === ELanguage.GERMAN_ORIGINAL
		)
	}

	return sentData
}

export const unmergeEpisodes = async (merged_chapter_id: number) => {
	const res = await fetchAPI<
		TEpisodeUnmergeResponse,
		TNoParams,
		TEpisodeUnmergeParams
	>({
		method: 'PATCH',
		url: API_URLS.UNMERGE_EPISODES,
		body: {
			merged_chapter_id,
		},
	})
	return res.data
}

export const inventEpisode = async ({
	project_id,
	chapter_title,
	seq_number,
	language,
}: {
	chapter_title: string
	language?: ELanguage
	project_id: number
	seq_number: number
}) => {
	const res = await fetchAPI<
		TEpisodeInventResponse,
		TNoParams,
		TEpisodeInventParams
	>({
		method: 'POST',
		url: API_URLS.INVENT_EPISODE,
		body: {
			project_id,
			chapter_title,
			seq_number,
			content: 'Start typing here...',
			language,
		},
	})
	return res.data
}

export const deleteEpisode = async (chapter_id: number) => {
	const res = await fetchAPI<TEpisodeDeleteResponse, TEpisodeDeleteURLParams>({
		method: 'PATCH',
		url: API_URLS.DELETE_EPISODE,
		urlParams: {
			chapter_id,
		},
	})
	return res.data
}

export const deleteMultipleEpisode = async ({
	project_id,
	seq_nos,
}: {
	project_id: number
	seq_nos: number[]
}) => {
	const res = await fetchAPI<
		TMultiEpisodeDeleteResponse,
		TMultiEpisodeDeleteURLParams,
		TMultiEpisodeDeleteBody
	>({
		method: 'POST',
		url: API_URLS.DELETE_MULTIPLE_EPISODES,
		urlParams: {
			project_id,
		},
		body: {
			seq_nos,
		},
	})
	if (!res.success) {
		throw Error(res?.message?.['error'] || 'Episodes not deleted')
	}

	return res.data
}

export const updateStatus = async (
	project_id: number,
	parent_id: number,
	status: string,
	language?: ELanguage
) => {
	const res = await fetchAPI<
		TStatusUpdateResponse,
		TStatusUpdateURLParams,
		TStatusUpdateBody
	>({
		method: 'PATCH',
		url: API_URLS.UPDATE_STATUS,
		urlParams: {
			project_id,
			parent_id,
		},
		body: {
			status,
			language,
		},
	})
	return res.data
}

export const getNotes = async (project_id: number) => {
	const res = await fetchAPI<TGetNotesResponse, { project_id: number }>({
		method: 'GET',
		url: API_URLS.GET_NOTES,
		urlParams: {
			project_id,
		},
	})
	return res.data?.data
}

export const updateNotes = async ({
	project_id,
	params,
}: {
	params: TNotesUpdateBody
	project_id: number
}) => {
	const res = await fetchAPI<
		{ message: string },
		{ project_id: number },
		TNotesUpdateBody
	>({
		method: 'POST',
		url: API_URLS.UPDATE_NOTES,
		urlParams: {
			project_id,
		},
		body: params,
	})

	if (!res.success) {
		throw res.error
	}
	return res.data
}
