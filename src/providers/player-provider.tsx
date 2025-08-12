'use client'

import React, {
	createContext,
	useCallback,
	useContext,
	useRef,
	useState,
} from 'react'
import { TTS_MUTATION } from '@/constants/query-constants'
import { BubbleCrossedIcon } from '@/icons/bubble-crossed-icon'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

import { splitStringByLength } from '@/lib/utils/helpers'

import { TElevenLabsAPIBody } from '@/types/ai-types'
import { TPlayingEpisode } from '@/types/episode-type'

function usePlayerUtil() {
	const [playingEpisode, setPlayingEpisode] = useState<TPlayingEpisode | null>(
		null
	)
	const audioRef = useRef<HTMLAudioElement | null>(null)
	const [controller, setController] = useState<AbortController | null>(
		new AbortController()
	)

	const setAudioUrl = useCallback((chunks: BlobPart[]) => {
		if (!audioRef.current) {
			return
		}
		const blob = new Blob(chunks, { type: 'audio/mpeg' })
		const audioUrl = URL.createObjectURL(blob)
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
	}, [])

	async function ttsMutation({
		info,
		text,
	}: TPlayingEpisode & TElevenLabsAPIBody) {
		setPlayingEpisode({
			info,
		})

		const parts = splitStringByLength(text, 10000)

		const chunks: BlobPart[] = []

		for (const part of parts) {
			const controller = new AbortController()
			setController(controller)

			const response = await fetch('/api/tts', {
				body: JSON.stringify({ text: part }),
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				signal: controller?.signal,
			})

			if (!response.body) {
				console.error('Stream not supported by the server')
				return ''
			}

			const reader = response.body.getReader()
			let done = false
			let prevNow = Date.now()

			while (!done) {
				const { value, done: doneReading } = await reader.read()
				done = doneReading
				if (!value) {
					continue
				}
				chunks.push(value)
				const currNow = Date.now()
				const diff = currNow - prevNow
				if (diff < 3000 && !done) {
					continue
				}
				prevNow = currNow
				setAudioUrl(chunks)
			}

			setAudioUrl(chunks)
		}

		return chunks
	}

	const mutation = useMutation({
		mutationKey: [TTS_MUTATION],
		mutationFn: ttsMutation,
		onSuccess: (data) => {
			if (!data) {
				toast.error('Error in TTS conversion', {
					icon: <BubbleCrossedIcon />,
				})
				setPlayingEpisode(null)
				return
			}
		},
		onError: (err) => {
			console.error(err)
			toast.error('Error in TTS conversion', {
				icon: <BubbleCrossedIcon />,
			})
			setPlayingEpisode(null)
		},
	})

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
