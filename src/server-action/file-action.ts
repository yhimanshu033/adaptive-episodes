'use server'

import { getBlob, getDownloadURL, ref, uploadBytes } from 'firebase/storage'

import { storage } from '@/lib/firebase'

const baseFilePath = 'gs://ai-cowriter-german-team.appspot.com'

export const fetchDownloadURL = async (
	storageURL: string | null
): Promise<string> => {
	try {
		if (!storageURL) return ''

		const storageRef = ref(storage, storageURL)
		const url = await getDownloadURL(storageRef)
		if (url.includes('.txt')) {
			const response = await fetch(url)

			if (!response.ok) {
				throw new Error(`Failed to fetch text file from ${url}`)
			}

			const text = await response.text()
			return text
		}

		return url
	} catch (error) {
		const { message } = error as Error
		throw new Error(message || "Couldn't fetch URL")
	}
}

export const uploadFiles = async ({
	storyId,
	episodeId,
	versionId,
	storagePath,
	textData,
	type,
}: {
	episodeId: string
	storagePath?: string
	storyId: string
	textData?: string
	type: string
	versionId: string
}) => {
	if (!storagePath && !textData) return null
	const filePath = `${baseFilePath}/stories/${storyId}/episodes/${episodeId}/versions/${versionId}/${type}.txt`
	const fileData = storagePath
		? await getBlob(ref(storage, storagePath))
		: textData
			? new Blob([textData], { type: 'text/plain;charset=utf-8' })
			: null
	if (!fileData) return null
	const storageRef = ref(storage, filePath)
	await uploadBytes(storageRef, fileData)
	return filePath
}
