import { EpisodeContedApiResponse } from '@/types/content-types'

export const getEpisodeContent = async (story: string, episodeId: string) => {
	try {
		const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/stories/${story}/episodes/${episodeId}/content`
		const data = (await fetch(url).then((res) =>
			res.json()
		)) as EpisodeContedApiResponse

		if (!data.status) {
			throw new Error(data.error)
		}

		return data
	} catch (error) {
		const { message } = error as Error
		throw new Error(message || 'Episode content not found')
	}
}
