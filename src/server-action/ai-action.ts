import { LASERTOOLS_URL } from '@/constants/api-constants'

import { LaserToolsApiResponse, LaserToolsParams } from '@/types/ai-types'

export const rephraseText = async ({
	action,
	text,
	prevtext,
	nexttext,
	context,
}: LaserToolsParams) => {
	try {
		const url = `${LASERTOOLS_URL}`
		const response = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				api_key: `${process.env.NEXT_PUBLIC_LASERTOOLS_API_KEY}`,
				action,
				text,
				prevtext,
				nexttext,
				context,
			}),
		})
		const data = (await response.json()) as LaserToolsApiResponse

		return data.data
	} catch (error) {
		const { message } = error as Error
		throw new Error(message || 'Failed to rephrase text')
	}
}
