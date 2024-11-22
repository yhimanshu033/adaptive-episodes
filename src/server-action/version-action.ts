import { collection, getDocs } from 'firebase/firestore'

import { db } from '@/lib/firebase'

export const getEpisodeVersions = async ({
	storyId,
	episodeId,
}: {
	episodeId: string
	storyId: string
}) => {
	try {
		const versionColRef = collection(
			db,
			'stories',
			storyId,
			'episodes',
			episodeId,
			'versions'
		)

		const snapshot = await getDocs(versionColRef)
		return snapshot.docs.map((version) => version.id)
	} catch (error) {
		const { message } = error as Error
		throw Error(message || "Couldn't fetch versions")
	}
}
