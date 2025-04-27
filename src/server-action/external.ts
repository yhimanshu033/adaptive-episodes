'use server'

import { API_URLS } from '@/constants/global-constants'

export async function elevenLabsTTS(value: string) {
	const response = await fetch(API_URLS.ELEVENLABS_TTS, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'xi-api-key': process.env.ELEVENLABS_API_KEY || '',
		},
		body: JSON.stringify({
			text: value,
			model_id: 'eleven_multilingual_v2',
		}),
	})

	if (!response.body) {
		console.error('Stream not supported by the server')
		return ''
	}

	const reader = response.body.getReader()
	let done = false
	const chunks: Uint8Array[] = []

	while (!done) {
		const { value, done: doneReading } = await reader.read()
		done = doneReading
		if (!value) {
			continue
		}
		chunks.push(value)
	}

	return chunks
}
