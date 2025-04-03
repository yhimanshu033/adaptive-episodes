import { useCallback, useEffect, useMemo, useState } from 'react'
import { TTS_MUTATION } from '@/constants/query-constants'
import { elevenLabsTTS } from '@/server-action/external'
import { useMutation } from '@tanstack/react-query'
import { useEditorState } from '@udecode/plate-common/react'
import { toast } from 'sonner'

import useEpisodeId from '@/providers/episode-id-provider'
import { getText } from '@/lib/utils/plate'

export default function useStreamedTTS() {
	const [audioUrl, setAudioUrl] = useState<string>('')
	const [time, setTime] = useState(0)
	const [duration, setDuration] = useState(0)
	const [isPlaying, setIsPlaying] = useState(true)
	const episodeId = useEpisodeId()

	const { children } = useEditorState()
	const text = useMemo(() => getText(children, '.\n'), [children])

	const getAudioElem = useCallback(
		() =>
			document.getElementById(`${episodeId}-audio-player`) as
				| HTMLAudioElement
				| undefined,
		[episodeId]
	)

	// async function ttsStreamMutation() {
	// 	toast.info('Starting TTS process')

	// 	const response = await fetch(
	// 		'https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM/stream?output_format=mp3_44100_128',
	// 		{
	// 			method: 'POST',
	// 			headers: {
	// 				'Content-Type': 'application/json',
	// 				'xi-api-key': process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY || '',
	// 			},
	// 			body: JSON.stringify({
	// 				text,
	// 				model_id: 'eleven_multilingual_v2',
	// 			}),
	// 		}
	// 	)

	// 	if (!response.body) {
	// 		console.error('Stream not supported by the server')
	// 		return
	// 	}

	// 	const reader = response.body.getReader()
	// 	const decoder = new TextDecoder()
	// 	let done = false
	// 	let result = ''
	// 	const chunks: Uint8Array[] = []

	// 	while (!done) {
	// 		const audioElem = getAudioElem()

	// 		const { value, done: doneReading } = await reader.read()
	// 		done = doneReading
	// 		result += decoder.decode(value, { stream: true })

	// 		if (!value) continue
	// 		chunks.push(value)

	// 		const blob = new Blob(chunks, { type: 'audio/mpeg' })
	// 		const audioUrl = URL.createObjectURL(blob)

	// 		setAudioUrl(audioUrl)

	// 		if (!audioElem) continue
	// 		const currentTime = audioElem.currentTime
	// 		audioElem.src = audioUrl
	// 		audioElem.currentTime = currentTime
	// 	}

	// 	return audioUrl
	// }

	async function ttsMutation() {
		toast.info('Starting TTS process')
		const chunks = await elevenLabsTTS(text)

		if (!chunks) return

		const blob = new Blob(chunks, { type: 'audio/mpeg' })
		const audioUrl = URL.createObjectURL(blob)

		setAudioUrl(audioUrl)
		const audioElem = getAudioElem()
		if (audioElem) {
			const currentTime = audioElem.currentTime
			audioElem.src = audioUrl
			audioElem.currentTime = currentTime
			void audioElem.play()
		}

		return audioUrl
	}

	const mutation = useMutation({
		mutationKey: [TTS_MUTATION],
		mutationFn: ttsMutation,
		onSuccess: () => {
			toast.success('TTS process completed')
		},
	})

	function reset() {
		mutation.reset()
		setAudioUrl('')
		setIsPlaying(true)
		setTime(0)
	}

	function handlePlay() {
		const audioElem = getAudioElem()
		if (!audioElem) return
		void audioElem.play()
		setIsPlaying(true)
	}

	function handlePause() {
		const audioElem = getAudioElem()
		if (!audioElem) return
		void audioElem.pause()
		setIsPlaying(false)
	}

	function handleTimeUpdate(time: number) {
		const audioElem = getAudioElem()
		if (!audioElem) return
		setTime(time)
		audioElem.currentTime = time
	}

	useEffect(() => {
		const audioElem = getAudioElem()

		if (!audioElem) return
		audioElem.ontimeupdate = () => {
			setTime(audioElem.currentTime)
		}
		audioElem.ondurationchange = () => {
			setDuration(audioElem.duration)
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	useEffect(() => {
		const audioElem = getAudioElem()

		if (!audioElem) return
		audioElem.onplay = () => {
			if (!isPlaying) void audioElem.pause()
		}
		audioElem.onpause = () => {
			if (isPlaying) void audioElem.play()
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isPlaying])

	return {
		...mutation,
		audioUrl,
		time,
		handlePlay,
		handlePause,
		isPlaying,
		handleTimeUpdate,
		duration,
		reset,
	}
}
