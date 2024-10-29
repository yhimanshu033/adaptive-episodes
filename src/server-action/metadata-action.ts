'use server'

import {
	collection,
	doc,
	getDoc,
	getDocs,
	orderBy,
	query,
	where,
} from 'firebase/firestore'

import { db } from '@/lib/firebase'

import { EpisodeDocType, VersionDocType } from '@/types/episode-type'

import { fetchDownloadURL } from './file-action'

export const getMetadata = async (
	storyId: string,
	start: number,
	end: number
) => {
	try {
		const episodeCollRef = collection(db, 'stories', storyId, 'episodes')

		const episodesQuery = query(
			episodeCollRef,
			where('episodeNumber', '>=', start),
			where('episodeNumber', '<=', end),
			orderBy('episodeNumber')
		)

		const querySnapshot = await getDocs(episodesQuery)

		const metadata = await Promise.all(
			querySnapshot.docs.map(async (episodeDoc) => {
				const { activeVersionId } = episodeDoc.data() as EpisodeDocType
				const versionDocRef = doc(episodeDoc.ref, 'versions', activeVersionId)
				const { loglines, beatsheets } = (
					await getDoc(versionDocRef)
				).data() as VersionDocType

				return {
					loglines: await fetchDownloadURL(loglines),
					beatsheets: await fetchDownloadURL(beatsheets),
				}
			})
		)

		const previousEpisodeQuery = query(
			episodeCollRef,
			where('episodeNumber', '==', start - 1)
		)

		let previousEpisodeContext = null
		if (start - 1) {
			const previousEpisodeDoc = (await getDocs(previousEpisodeQuery)).docs[0]
			const { activeVersionId } = previousEpisodeDoc.data() as EpisodeDocType
			const versionDocRef = doc(
				previousEpisodeDoc.ref,
				'versions',
				activeVersionId
			)
			const { context } = (await getDoc(versionDocRef)).data() as VersionDocType
			previousEpisodeContext = await fetchDownloadURL(context)
		}

		return {
			metadata,
			previousEpisodeContext,
		}
	} catch (error) {
		const { message } = error as Error
		throw new Error(message || 'Failed to get loglines')
	}
}
