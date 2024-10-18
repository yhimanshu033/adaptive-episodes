/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
	CHATBOT,
	LASERTOOLS_URL,
	STORY_EXPLORER,
} from '@/constants/api-constants'

import {
	AIChatBotApiResponse,
	AIChatBotParams,
	LaserToolsApiResponse,
	LaserToolsParams,
	PlotExplorerApiResponse,
	PlotExplorerParams,
} from '@/types/ai-types'

const fetchWithErrorHandling = async (
	url: string,
	body: Record<string, unknown>
): Promise<unknown> => {
	try {
		const response = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(body),
		})
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`)
		}
		return await response.json()
	} catch (error) {
		throw new Error((error as Error).message || 'Network error')
	}
}

export const rephraseText = async (
	params: LaserToolsParams
): Promise<LaserToolsApiResponse['data']> => {
	const body = {
		api_key: process.env.NEXT_PUBLIC_LASERTOOLS_API_KEY,
		...params,
	}
	const data = (await fetchWithErrorHandling(
		LASERTOOLS_URL,
		body
	)) as LaserToolsApiResponse
	return data.data
}

export const getChatbotResponse = async (
	params: AIChatBotParams
): Promise<AIChatBotApiResponse['data']> => {
	const {
		context = '',
		ep_number = '',
		highlighted_text = '',
		messages = [],
		query,
		ep_text = '',
		loglines_array = [],
		beatsheets_array = [],
	} = params
	console.log(params)
	const body = {
		api_key: process.env.NEXT_PUBLIC_LASERTOOLS_API_KEY,
		context,
		highlighted_text,
		messages: messages.slice(1),
		query,
		ep_number,
		ep_text,
		loglines_array,
		beatsheets_array,
	}
	const data = (await fetchWithErrorHandling(
		CHATBOT,
		body
	)) as AIChatBotApiResponse
	return data.data
}

export const getPlotOutline = async (
	params: PlotExplorerParams
): Promise<PlotExplorerApiResponse['data']> => {
	const body = {
		api_key: process.env.NEXT_PUBLIC_LASERTOOLS_API_KEY,
		...params,
	}
	const data = (await fetchWithErrorHandling(
		STORY_EXPLORER,
		body
	)) as PlotExplorerApiResponse
	return data.data
}
