'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { API_URLS } from '@/constants/global-constants'
import { TGetAssemblyAITokenResponse } from '@/page-builders/episodes/outliner-questionnaire/lib/types'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

import { fetchAPI } from '@/lib/fetch-api'

type TranscriptMap = Record<number, string>

export function useSpeechToText() {
	const socket = useRef<WebSocket | null>(null)
	const audioContext = useRef<AudioContext | null>(null)
	const mediaStream = useRef<MediaStream | null>(null)
	const scriptProcessor = useRef<ScriptProcessorNode | null>(null)

	const [isRecording, setIsRecording] = useState(false)
	const [transcripts, setTranscripts] = useState<TranscriptMap>({})

	/** useMutation for fetching AssemblyAI token */
	const tokenMutation = useMutation({
		mutationFn: async (): Promise<string> => {
			const response = await fetchAPI<TGetAssemblyAITokenResponse>({
				method: 'GET',
				url: API_URLS.GET_ASSEMBLY_AI_TOKEN,
			})
			if (!response.data?.token) {
				toast.info('Speech to text initialization failed!')
				throw new Error('Failed to get token')
			}
			return response.data.token
		},
	})

	/** Stops recording and closes connections */
	const stopRecording = useCallback(() => {
		setIsRecording(false)

		if (scriptProcessor.current) {
			scriptProcessor.current.disconnect()
			scriptProcessor.current = null
		}

		if (audioContext.current) {
			void audioContext.current.close()
			audioContext.current = null
		}

		if (mediaStream.current) {
			mediaStream.current.getTracks().forEach((t) => t.stop())
			mediaStream.current = null
		}

		if (socket.current) {
			try {
				socket.current.send(JSON.stringify({ type: 'Terminate' }))
			} finally {
				socket.current.close()
				socket.current = null
			}
		}

		console.info('🧹 Cleaned up recording resources')
	}, [])

	/** Starts streaming microphone audio to AssemblyAI */
	const startRecording = useCallback(async () => {
		try {
			const token = await tokenMutation.mutateAsync()

			if (!token) {
				return
			}

			const wsUrl = `wss://streaming.eu.assemblyai.com/v3/ws?sample_rate=16000&formatted_finals=false&token=${token}`
			const turns: TranscriptMap = {}

			socket.current = new WebSocket(wsUrl)

			socket.current.onopen = async () => {
				console.info('✅ WebSocket connected')
				setIsRecording(true)

				mediaStream.current = await navigator.mediaDevices.getUserMedia({
					audio: true,
				})
				audioContext.current = new AudioContext({ sampleRate: 16000 })

				const source = audioContext.current.createMediaStreamSource(
					mediaStream.current
				)
				scriptProcessor.current = audioContext.current.createScriptProcessor(
					4096,
					1,
					1
				)

				source.connect(scriptProcessor.current)
				scriptProcessor.current.connect(audioContext.current.destination)

				scriptProcessor.current.onaudioprocess = (event) => {
					if (!socket.current || socket.current.readyState !== WebSocket.OPEN) {
						return
					}

					const input = event.inputBuffer.getChannelData(0)
					const buffer = new Int16Array(input.length)
					for (let i = 0; i < input.length; i++) {
						buffer[i] = Math.max(-1, Math.min(1, input[i])) * 0x7fff
					}

					socket.current.send(buffer.buffer)
				}
			}

			socket.current.onmessage = (event: { data: string }) => {
				const message = JSON.parse(event?.data) as
					| { transcript: string; turn_order: number; type: string }
					| undefined

				if (message?.type === 'Turn') {
					const { turn_order, transcript } = message
					turns[turn_order] = transcript
					setTranscripts({ ...turns })
				}
			}

			socket.current.onerror = (err) => {
				console.error('❌ WebSocket error:', err)
				stopRecording()
			}

			socket.current.onclose = (event) => {
				console.info('🔒 WebSocket closed', event?.code, event?.reason)
				socket.current = null
				stopRecording()
			}
		} catch (err) {
			console.error('Error starting recording:', err)
			alert('Failed to start recording')
		}
	}, [tokenMutation, stopRecording])

	// /** Auto cleanup when component using this hook unmounts */
	useEffect(() => {
		return () => {
			stopRecording()
		}
	}, [stopRecording])

	const orderedTranscript = Object.keys(transcripts)
		.sort((a, b) => Number(a) - Number(b))
		.map((k) => transcripts[Number(k)])
		.join(' ')

	return {
		isRecording,
		isLoading: tokenMutation.isPending,
		transcripts,
		orderedTranscript,
		startRecording,
		stopRecording,
	}
}
