/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'

import { episodeLimit } from '@/constants/episodes-constants'
import {
	collection,
	doc,
	getCountFromServer,
	getDoc,
	getDocs,
	limit,
	orderBy,
	query,
	startAt,
	where,
} from 'firebase/firestore'

import { db } from '@/lib/firebase'

import {
	EpisodeDocType,
	EpisodeType,
	VersionDocType,
} from '@/types/episode-type'

export const getEpisodes = async (
	storyId: string,
	page: number = 1,
	episodeFilter: string = ''
) => {
	try {
		const firstEpisodeNumber = (page - 1) * episodeLimit + 1

		const storyDocRef = doc(db, 'stories', storyId)
		const episodesCollRef = collection(storyDocRef, 'episodes') //Get episodes collection instance

		const constraints: any[] = [orderBy('episodeNumber')]

		if (episodeFilter) {
			constraints.push(
				where('title.de', '>=', episodeFilter),
				where('title.de', '<=', episodeFilter + '\uf8ff') // Prefix filter
			)
		}

		//count total matches
		const countQuery = query(episodesCollRef, ...constraints)
		const totalEpisodes = (await getCountFromServer(countQuery)).data().count

		//Query to sort documents
		const episodeQuery = query(
			episodesCollRef,
			...constraints,
			startAt(firstEpisodeNumber),
			limit(episodeLimit)
		)
		const episodesSnapshot = await getDocs(episodeQuery) //Fetch documents in sorted order

		const episodes: EpisodeType[] = await Promise.all(
			episodesSnapshot.docs.map(async (document) => {
				const episodeData = document.data() as EpisodeDocType
				const versionId = episodeData.activeVersionId
				const versionDocRef = doc(document.ref, 'versions', versionId)
				const versionData = (
					await getDoc(versionDocRef)
				).data() as VersionDocType
				return {
					writer: versionData.writer,
					title: episodeData.title.de,
					id: document.id,
					updatedAt: versionData.updatedAt,
					status: versionData.status,
					wordCount: versionData.wordCount,
				}
			})
		)

		return {
			currentPage: page,
			episodes: episodes,
			hasNext: totalEpisodes > page * episodeLimit,
			totalEpisodes,
			totalPages: Math.ceil(totalEpisodes / episodeLimit),
		}
	} catch (error) {
		const { message } = error as Error
		throw Error(message || 'Failed to fetch episodes')
	}
}
