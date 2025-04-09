'use client'

import React, {
	createContext,
	useContext,
	useEffect,
	useRef,
	useState,
} from 'react'
import { API_URLS } from '@/constants/global-constants'
import { TTS_MUTATION } from '@/constants/query-constants'
import useSocketStreaming from '@/hooks/use-socket-streaming'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

import { TElevenLabsAPIBody, TTSAPIBody } from '@/types/ai-types'
import { TPlayingEpisode } from '@/types/episode-type'

function usePlayerUtil() {
	const [playingEpisode, setPlayingEpisode] = useState<TPlayingEpisode | null>(
		null
	)
	const audioRef = useRef<HTMLAudioElement | null>(null)
	const [controller, setController] = useState<AbortController | null>(
		new AbortController()
	)
	const { startTask, responses } = useSocketStreaming()
	const currentTime = useRef(Date.now())

	async function ttsMutation({
		info,
		text,
	}: TPlayingEpisode & TElevenLabsAPIBody) {
		const controller = new AbortController()
		setController(controller)
		setPlayingEpisode({
			info,
		})

		const taskId = await startTask<TTSAPIBody>({
			method: 'POST',
			url: API_URLS.COPILOT_TTS,
			body: {
				ep_text: text,
			},
		})
		currentTime.current = Date.now()
		return taskId
	}

	const mutation = useMutation({
		mutationKey: [TTS_MUTATION],
		mutationFn: ttsMutation,
		onSuccess: (data) => {
			if (!data) {
				toast.error('Error in TTS conversion')
				setPlayingEpisode(null)
				return
			}
		},
	})

	const { data } = mutation

	/*

	const reader = response.body.getReader()
		let done = false
		const chunks: Uint8Array[] = []

		let prevNow = Date.now()

		while (!done) {
			const { value, done: doneReading } = await reader.read()
			done = doneReading
			if (!value) continue
			chunks.push(value)
			const currNow = Date.now()
			const diff = currNow - prevNow
			if (diff < 3000 && !done) continue
			prevNow = currNow
			const blob = new Blob(chunks, { type: 'audio/mpeg' })
			const audioUrl = URL.createObjectURL(blob)

			if (!audioRef.current) continue
			const time = audioRef.current?.currentTime
			const isPaused = audioRef.current?.paused
			const currentSrc = audioRef.current?.src
			audioRef.current.src = audioUrl
			audioRef.current.currentTime = time

			if (currentSrc) {
				audioRef.current.currentTime = time
			}
			if (currentSrc && isPaused) {
				audioRef.current.pause()
			}
		}

		return chunks
	 */

	useEffect(() => {
		const now = Date.now()
		if (
			!data ||
			!responses[data] ||
			!audioRef.current ||
			now - currentTime.current < 3000
		)
			return
		currentTime.current = now
		const b64 = responses[data].join()

		const audioUrl = b64

		const time = audioRef.current?.currentTime
		const isPaused = audioRef.current?.paused
		const currentSrc = audioRef.current?.src

		if (currentSrc === audioUrl) return
		audioRef.current.src = audioUrl
		audioRef.current.currentTime = time

		if (currentSrc) {
			audioRef.current.currentTime = time
		}
		if (currentSrc && isPaused) {
			audioRef.current.pause()
		}
	}, [responses, data])

	function customReset() {
		if (controller) {
			controller.abort()
		}
		mutation.reset()
	}

	return {
		playingEpisode,
		setPlayingEpisode,
		audioRef,
		mutation: { ...mutation, reset: customReset },
	}
}

const PlayerContext = createContext<ReturnType<typeof usePlayerUtil> | null>(
	null
)

export function PlayerProvider({ children }: { children: React.ReactNode }) {
	const value = usePlayerUtil()

	return (
		<PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>
	)
}

export default function usePlayer() {
	const context = useContext(PlayerContext)
	if (!context) {
		throw new Error('usePlayer must be used within a PlayerProvider')
	}
	return context
}
