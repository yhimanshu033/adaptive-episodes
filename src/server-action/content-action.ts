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
import { ref, uploadBytes } from 'firebase/storage'

import { db, storage } from '@/lib/firebase'

import { EpisodeDocType, VersionDocType } from '@/types/episode-type'

import { fetchDownloadURL } from './file-action'

export const getEpisodeContent = async (storyId: string, episodeId: string) => {
	try {
		const storyDocRef = doc(db, 'stories', storyId)

		const episodeDocRef = doc(storyDocRef, 'episodes', episodeId)
		const { episodeNumber, title, activeVersionId } = (
			await getDoc(episodeDocRef)
		).data() as EpisodeDocType

		const versionDocRef = doc(episodeDocRef, 'versions', activeVersionId)
		const { context, content, summaries } = (
			await getDoc(versionDocRef)
		).data() as VersionDocType

		const { nextEpisodeId, previousEpisodeId } = await getEpisodeWithNeighbors(
			storyId,
			episodeId
		)

		return {
			context: await fetchDownloadURL(context),
			de: await fetchDownloadURL(content.de),
			episodeNumber,
			title,
			nextEpisodeId,
			previousEpisodeId,
			us: await fetchDownloadURL(content.us),
			summary: summaries.de,
			activeVersionId,
		}
	} catch (error) {
		const { message } = error as Error
		throw new Error(message || 'Episode content not found')
	}
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
	storyId,
	episodeId,
	content,
}: {
	content: string
	episodeId: string
	storyId: string
}) => {
	try {
		const episodeDocRef = doc(db, 'stories', storyId, 'episodes', episodeId)
		const { activeVersionId } = (
			await getDoc(episodeDocRef)
		).data() as EpisodeDocType

		const versionDocRef = doc(episodeDocRef, 'versions', activeVersionId)
		const {
			content: { de },
		} = (await getDoc(versionDocRef)).data() as VersionDocType

		const storageRef = ref(storage, de)
		const textBlob = new Blob([content], { type: 'text/plain' })
		await uploadBytes(storageRef, textBlob)

		return {
			status: 'OK',
			message: 'File Saved Successfully',
		}
	} catch (error) {
		const { message } = error as Error
		throw new Error(message || 'File not saved')
	}
}
