import { CHATBOT, LASERTOOLS_URL } from '@/constants/api-constants'

import {
	AIChatBotApiResponse,
	AIChatBotParams,
	LaserToolsApiResponse,
	LaserToolsParams,
} from '@/types/ai-types'

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

export const getChatbotResponse = async ({
	context = '',
	ep_number = '',
	highlighted_text = '',
	messages = [],
	query,
}: AIChatBotParams) => {
	try {
		const url = `${CHATBOT}`
		const response = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				api_key: `${process.env.NEXT_PUBLIC_LASERTOOLS_API_KEY}`,
				context,
				highlighted_text,
				messages,
				query,
				ep_number,
			}),
		})
		const data = (await response.json()) as AIChatBotApiResponse

		return data.data
	} catch (error) {
		const { message } = error as Error
		throw new Error(message || 'Failed to get chatbot reponse')
	}
}
