import { EpisodeResponse } from '@/types/episode-type'

export const getEpisodes = async (
	story: string,
	page?: number,
	episodeFilter?: string
) => {
	try {
		const queryParams = new URLSearchParams()
		if (page) queryParams.append('page', page.toString())
		if (episodeFilter) queryParams.append('episode_search', episodeFilter)
		const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/stories/${story}/episodes?${queryParams.toString()}`
		const data = (await fetch(url).then((res) => res.json())) as EpisodeResponse

		if (!data.status) {
			throw new Error(data.error as string)
		}

		return data
	} catch (error) {
		const { message } = error as Error
		throw new Error(message || 'Failed to get episode')
	}
}
