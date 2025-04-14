import { API_URLS } from '@/constants/global-constants'

import { TElevenLabsAPIBody } from '@/types/ai-types'

export async function POST(request: Request) {
	try {
		const { text } = (await request.json()) as TElevenLabsAPIBody

		const response = await fetch(API_URLS.ELEVENLABS_TTS, {
			next: { revalidate: 0 },
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'xi-api-key': process.env.ELEVENLABS_API_KEY || '',
			},
			body: JSON.stringify({
				text,
				model_id: 'eleven_multilingual_v2',
				voice_settings: {
					style: 0,
					stability: 0.1,
					similarity_boost: 0.75,
				},
			}),
			signal: request.signal,
		})

		if (!response.body) {
			console.error('Stream not supported by the server')
			return new Response('Stream not supported by the server', {
				status: 500,
				statusText: 'Stream not supported by the server',
			})
		}

		const reader = response.body.getReader()

		const stream = new ReadableStream({
			async pull(controller) {
				const { value, done } = await reader.read()
				if (done || request.signal.aborted) {
					controller.close()
				} else {
					controller.enqueue(value)
				}
			},
		})

		const resp = new Response(stream)

		return resp
	} catch (error) {
		console.error(error)
		return new Response('Internal Server Error', {
			status: 500,
			statusText: 'Internal Server Error',
		})
	}
}

export const revalidate = 0
