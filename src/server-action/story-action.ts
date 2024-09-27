import { StoryResponse } from '@/types/story-types'

export const getStories = async () => {
	try {
		const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/stories`
		const data = (await fetch(url).then((res) => res.json())) as StoryResponse

		if (!data.status) {
			throw new Error(data.error as string)
		}

		return data.data
	} catch (error) {
		const { message } = error as Error
		throw new Error(message || 'Failed to get story')
	}
}
