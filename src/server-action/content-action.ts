'use server'

import {
	collection,
	doc,
	getDoc,
	getDocs,
	limit,
	orderBy,
	query,
	where,
} from 'firebase/firestore'

import { fetchAPI } from '@/lib/fetch-api'
import { db } from '@/lib/firebase'

import {
	EpisodeDocType,
	TGetEpisodeResponse,
	TGetEpisodeUrlParams,
	TPatchEpisodeBody,
	TPatchEpisodeUrlParams,
} from '@/types/episode-type'

export const getEpisodeContent = async (chapterId: number) => {
	const episodeData = await fetchAPI<TGetEpisodeResponse, TGetEpisodeUrlParams>(
		{
			method: 'GET',
			url: '/chapter/:chapterId/content/',
			urlParams: {
				chapterId,
			},
		}
	)

	return episodeData.data
}

export const getEpisodeWithNeighbors = async (
	storyId: string,
	episodeId: string
) => {
	try {
		// Reference to the current episode
		const episodeDocRef = doc(db, 'stories', storyId, 'episodes', episodeId)

		// Fetch the current episode data
		const episodeSnapshot = await getDoc(episodeDocRef)
		const currentEpisode = episodeSnapshot.data() as EpisodeDocType

		if (!currentEpisode) {
			throw new Error('Episode not found')
		}

		const { episodeNumber } = currentEpisode

		// Prepare query to find the previous episode
		const prevEpisodeQuery = query(
			collection(db, 'stories', storyId, 'episodes'),
			where('episodeNumber', '<', episodeNumber),
			orderBy('episodeNumber', 'desc'), // To get the highest episode number less than current
			limit(1) // We only need the previous one
		)

		// Prepare query to find the next episode
		const nextEpisodeQuery = query(
			collection(db, 'stories', storyId, 'episodes'),
			where('episodeNumber', '>', episodeNumber),
			orderBy('episodeNumber'), // To get the lowest episode number greater than current
			limit(1) // We only need the next one
		)

		// Fetch previous and next episodes
		const prevEpisodeSnapshot = await getDocs(prevEpisodeQuery)
		const nextEpisodeSnapshot = await getDocs(nextEpisodeQuery)

		// Get the IDs or set to null if not found
		const previousEpisodeId =
			prevEpisodeSnapshot.docs.length > 0
				? prevEpisodeSnapshot.docs[0].id
				: null
		const nextEpisodeId =
			nextEpisodeSnapshot.docs.length > 0
				? nextEpisodeSnapshot.docs[0].id
				: null

		return {
			previousEpisodeId,
			nextEpisodeId,
		}
	} catch (error) {
		const { message } = error as Error
		throw new Error(message || 'Failed to fetch episode with neighbors')
	}
}

export const saveContent = async ({
	projectId,
	episodeId,
	...data
}: {
	episodeId: number
	projectId: number
	text: string
} & TPatchEpisodeBody) => {
	const responseData = await fetchAPI<
		TPatchEpisodeBody,
		TPatchEpisodeUrlParams,
		TPatchEpisodeBody
	>({
		method: 'PATCH',
		url: '/chapter/:projectId/:episodeId/',
		body: {
			...data,
		},
		urlParams: {
			projectId,
			episodeId,
		},
	})

	console.log(responseData.data)

	return responseData.data
}
