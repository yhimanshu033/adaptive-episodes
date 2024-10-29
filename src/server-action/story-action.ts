'use server'

import { collection, getDocs } from 'firebase/firestore'

import { db } from '@/lib/firebase'

import { StoryDocType } from '@/types/story-types'

import { fetchDownloadURL } from './file-action'

export const getStories = async () => {
	try {
		const storiesSnapshot = await getDocs(collection(db, 'stories'))
		const storiesDoc = await Promise.all(
			storiesSnapshot.docs.map(async (doc) => {
				const storyData = doc.data() as StoryDocType
				const thumbnailUrl = await fetchDownloadURL(storyData.thumbnailUrl)
				return {
					id: doc.id,
					...storyData,
					thumbnailUrl,
				}
			})
		)
		return storiesDoc
	} catch (error) {
		const { message } = error as Error
		throw new Error(message || 'Failed to fetch stories')
	}
}
