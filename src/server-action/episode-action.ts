'use server'

import { DEFAULT_EPISODES_DATA } from '@/constants/episodes-constants'

import { fetchAPI } from '@/lib/fetch-api'

import { TNoParams } from '@/types/common'
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
} from '@/types/episode-type'

export const getEpisodes = async (
	project_id: number,
	page: number = 1,
	search: string = ''
) => {
	const episodes = await fetchAPI<
		TGetEpisodesResponse,
		TNoParams,
		TNoParams,
		TGetEpisodesQueryParams
	>({
		method: 'GET',
		url: '/chapter/',
		defaultData: DEFAULT_EPISODES_DATA,
		query: {
			project_id,
			page,
			search,
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
		url: '/chapter/',
		query: {
			project_id,
			parent,
		},
	})
	return episodes.data
}

export const unmergeEpisodes = async (merged_chapter_id: number) => {
	const res = await fetchAPI<
		TEpisodeUnmergeResponse,
		TNoParams,
		TEpisodeUnmergeParams
	>({
		method: 'PATCH',
		url: '/chapters/unmerge/',
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
}: {
	chapter_title: string
	project_id: number
	seq_number: number
}) => {
	const res = await fetchAPI<
		TEpisodeInventResponse,
		TNoParams,
		TEpisodeInventParams
	>({
		method: 'POST',
		url: '/chapters/invent/',
		body: {
			project_id,
			chapter_title,
			seq_number,
			content: 'demo',
		},
	})
	return res.data
}

export const deleteEpisode = async (chapter_id: number) => {
	const res = await fetchAPI<TEpisodeDeleteResponse, TEpisodeDeleteURLParams>({
		method: 'PATCH',
		url: '/chapters/:chapter_id/delete/',
		urlParams: {
			chapter_id,
		},
	})
	return res.data
}
