/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
'use client'

import React, {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react'
import { ESocketStatus } from '@/constants/ai-constants'
import {
	COMMON_SITE_HEADERS,
	CORRELATION_ID_HEADER_KEY,
	FETCH_TIMEOUT,
	MAX_SOCKET_RETRIES,
	SOCKET_ERROR_TOAST_ID,
	SOCKET_STREAMING_TIMEOUT,
} from '@/constants/global-constants'
import * as Sentry from '@sentry/nextjs'
import { X } from 'lucide-react'
import { nanoid } from 'nanoid'
import { useSession } from 'next-auth/react'
import { io } from 'socket.io-client'
import { toast } from 'sonner'
import { v4 as uuid } from 'uuid'

import { Button } from '@/components/aural-ui/button'
import { fetchAPI, FetchRequestParams } from '@/lib/fetch-api'

import { TNoParams, TSocketQueryParams } from '@/types/common'

type TSocketStreamingContext =
	| {
			getStreamedResponse: (taskId: string) => Promise<string[]>
			getStreamedResponseChunks: (taskId: string) => any[]
			responses: Record<string, string[]>
			startTask: <
				BodyParamsT = TNoParams,
				ResponseDataT = TNoParams,
				UrlParamsT = TNoParams,
				QueryParamsT = TNoParams,
			>(
				params: FetchRequestParams<
					ResponseDataT,
					UrlParamsT,
					BodyParamsT,
					QueryParamsT
				> & {
					noCache?: boolean
					onResponse?: (data: ResponseDataT) => void
					onTimeout?: (taskId: string) => void
				}
			) => Promise<string>
			stopTask: (taskId: string) => void
			taskEnded: Record<string, boolean>
			tasksTimedOut: Set<string>
	  }
	| undefined

const SocketStreamingContext = createContext<TSocketStreamingContext>(undefined)

export const SocketStreamingProvider = ({
	children,
	baseUrl,
}: {
	baseUrl?: string
	children: React.ReactNode
}) => {
	const socketUrl =
		baseUrl ||
		process.env.NEXT_PUBLIC_SOCKET_URL ||
		process.env.NEXT_PUBLIC_BACKEND_URL ||
		''
	const { data: session } = useSession()
	const correlationId = useMemo(() => {
		return uuid()
	}, [])
	const failedCounterRef = useRef(0)
	const socket = useMemo(
		() =>
			io(socketUrl, {
				autoConnect: false,
				extraHeaders: {
					Authorization: `Bearer ${session?.accessToken}`,
					[CORRELATION_ID_HEADER_KEY]: correlationId,
					...COMMON_SITE_HEADERS,
				},
				retries: MAX_SOCKET_RETRIES,
				reconnectionAttempts: MAX_SOCKET_RETRIES,
				requestTimeout: FETCH_TIMEOUT,
				// transports: ['websocket'],
				// auth: {
				// 	token: `${session?.accessToken}`,
				// },
			}),
		[socketUrl, session, correlationId]
	)
	const [responses, setResponses] = useState<Record<string, string[]>>({})
	const taskCallbacksRef = useRef<Record<string, (data: any) => void>>({})
	const responsesRef = useRef<Record<string, string[]>>({})
	const blockedTasksRef = useRef<Record<string, boolean>>({})
	const [taskEnded, setTaskEnded] = useState<Record<string, boolean>>({})
	const [fetchedData, setFetchedData] = useState<Record<string, string>>({})
	const timeoutCallbacksRef = useRef<Record<string, (data: any) => void>>({})
	const timeoutsRef = useRef<Record<string, NodeJS.Timeout>>({})
	const [tasksTimedOut, setTasksTimedOut] = useState<Set<string>>(new Set())

	useEffect(() => {
		socket.connect()

		function handleSocketConnectionError(err: Error) {
			failedCounterRef.current = failedCounterRef.current + 1
			if (failedCounterRef.current === MAX_SOCKET_RETRIES) {
				Sentry.captureException(
					new Error(`Socket retry limit(${MAX_SOCKET_RETRIES}) reached`),
					{
						extra: {
							error: err,
							socketUrl,
							user: session?.user?.id,
						},
					}
				)
				toast('Unable to connect to streaming server.', {
					id: SOCKET_ERROR_TOAST_ID,
					action: (
						<>
							<Button
								innerClassName="w-30!"
								size="sm"
								onClick={() => {
									window.location.reload()
									toast.dismiss(SOCKET_ERROR_TOAST_ID)
								}}
							>
								Retry
							</Button>
							<X
								className="absolute top-1 right-1 z-10 cursor-pointer"
								onClick={() => toast.dismiss(SOCKET_ERROR_TOAST_ID)}
								size={12}
							/>
						</>
					),
					duration: Infinity,
				})
			}
		}
		socket.on('connect_error', handleSocketConnectionError)

		function handleSocketConnection() {
			failedCounterRef.current = 0
		}
		socket.on('connect', handleSocketConnection)

		socket.onAny(
			(
				task_id: string,
				payload: {
					chunk?: Record<string, string> | string
					status?: ESocketStatus
					task_id: string
				}
			) => {
				if (blockedTasksRef.current[task_id]) {
					return
				}

				const { chunk, status } = payload

				// Handle task start
				if (status === ESocketStatus.STARTED) {
					setTaskEnded((prev) => ({ ...prev, [task_id]: false }))
					if (timeoutsRef.current[task_id]) {
						clearTimeout(timeoutsRef.current[task_id])
						delete timeoutsRef.current[task_id]
					}
				}

				// Handle task completion
				const isCompleted = status === ESocketStatus.COMPLETED || chunk === ';]'
				if (isCompleted && !taskEnded[task_id]) {
					const callback = taskCallbacksRef.current[task_id]
					if (callback) {
						callback(responsesRef.current[task_id])
					}
					setTaskEnded((prev) => ({ ...prev, [task_id]: true }))
				}

				if (!responses) {
					setResponses((prev) => ({ ...prev, [task_id]: [] }))
					responsesRef.current[task_id] = []
				}

				if (!payload.chunk || payload.chunk === ';]') {
					return
				}

				const normalizedChunk =
					typeof chunk === 'object' ? JSON.stringify(chunk) : String(chunk)

				setResponses((prev) => ({
					...prev,
					[task_id]: [...(prev[task_id] || []), String(normalizedChunk)],
				}))

				responsesRef.current[task_id] = [
					...(responsesRef.current[task_id] || []),
					String(normalizedChunk),
				]
			}
		)
		return () => {
			socket.off('connect_error', handleSocketConnectionError)
			socket.off('connect', handleSocketConnection)
			socket.disconnect()
			Object.values(timeoutsRef.current).forEach(clearTimeout)
			timeoutsRef.current = {}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [socket])

	const startTask = useCallback(
		async <
			BodyParamsT = TNoParams,
			ResponseDataT = TNoParams,
			UrlParamsT = TNoParams,
			QueryParamsT = TNoParams,
		>(
			params: FetchRequestParams<
				ResponseDataT,
				UrlParamsT,
				BodyParamsT,
				QueryParamsT
			> & {
				noCache?: boolean
				onResponse?: (data: ResponseDataT) => void
				onTimeout?: (taskId: string) => void
			}
		) => {
			const key = JSON.stringify(params)
			const { noCache, onResponse, onTimeout, ...rest } = params
			if (fetchedData[key] && !noCache) {
				return fetchedData[key]
			}

			const taskId = nanoid()
			setFetchedData((prev) => ({ ...prev, [key]: taskId }))
			if (onResponse) {
				taskCallbacksRef.current[taskId] = onResponse
			}
			if (onTimeout) {
				timeoutCallbacksRef.current[taskId] = onTimeout
			}

			socket.emit('subscribe', { task_id: session?.user.id })
			await fetchAPI<
				ResponseDataT,
				UrlParamsT,
				BodyParamsT,
				QueryParamsT & TSocketQueryParams
			>({
				...rest,
				query: {
					task_id: taskId,
					room_id: 'true',
					...(params.query as QueryParamsT),
				},
			})

			// 			// test start
			// 			setTaskEnded((prev) => ({ ...prev, [taskId]: true }))
			// 			setResponses((prev) => ({
			// 				...prev,
			// 				[taskId]: [
			// 					JSON.stringify([
			// 						{
			// 							content: `test uhls.
			// Die sanfte Umarmung und der Kuss der fremden Frau hatten ihn erröten lassen.
			// Jan schaute missmutig drein.
			// Er wurde streng erzogen, seit er ein Baby war.
			// Jede seiner Mahlzeiten wurde sorgfältig zusammengestellt, ihm wurde beigebracht, wann er reden darf und wann er lieber schweigen sollte und wenn er das Bedürfnis hatte, nach draußen zu gehen, um das Anwesen der Forster Familie zu verlassen, wurde er von einer Entourage an Leibwächtern begleitet.
			// Aber in dem Jungen, der immer allen Anordnungen folgen musste, kam plötzlich ein starkes Verlangen auf.
			// Er verkündete selbstbewusst: „Ich möchte Mousse au Chocolat ".
			// Marcel Forster war verwirrt über die Reaktion des Kindes.
			// Er nahm ihn hoch und trug ihn auf einem Arm zurück in ihre Suite.
			// Mit einem eiskalten Blick ging Marcel zu seinem Computer hinüber und setzte seine Videokonferenz fort.
			// Die Person auf dem Bildschirm berichtete: „Herr Forster, wir können nun bestätigen, dass Athena tatsächlich nach Deutschland zurückgekehrt ist.
			// Außerdem haben wir soeben ein Foto von ihr erhalten -damit kann man arbeiten.
			// Ich werde es Ihnen sofort zusenden." [MUSIC: Threatening music] Marcels dünne Lippen spitzten sich leicht, nur zwei Worte spuckte er aus: „Findet sie!" In der Villa der Schmidts erhellten unzählige Kronleuchter das gesamte Interieur.
			// Draußen vor der Tür hörte Varad, wie das digitale Schloss die Sprachansage " Eingabefehler " wiederholte, und ihre Lippen verzogen sich zu einem spöttischen Lächeln. [SFX: Error noise lock] Das Passwort war geändert worden, und natürlich hatte sich niemand die Mühe gemacht, es ihr mitzuteilen.
			// Sie senkte emotionslos den Blick, nahm ihr Handy und tippte darauf herum. berührte sie mit dem Display das digitale Schloss.
			// Ein paar Sekunden später öffnete sich die Tür mit einem Klicken. [SFX: Opening noise lock] Im Wohnzimmer herrschte eine lebhafte Atmosphäre.
			// Als Varad die versammelte Menge sah, wurde ihr klar, dass sie sich auf der Geburtstagsfeier ihrer jüngeren Halbschwester, Clara, befand.
			// Niemand sah sie kommen, also suchte Varad ein Sofa in der Ecke und setzte sich, um sich ein wenig auszuruhen.
			// Doch schon bald hörte sie einen leisen Schrei, der von der Terrasse nach drinnen drang.`,
			// 							id: 'e38c0c9d-25bb-4d63-a823-8f2d43733071',
			// 						},
			// 						{
			// 							content: `test „N-o-r-a.
			// S-chmidt." Hanna zeigte auf das Schild in Antons Hand „Richtig, oder?", fragte sie aufgeregt.
			// Anton war geblendet von dem kleinen Lächeln, das ihre Lippen umspielte, als sie auf ihre Tochter herabblickte.
			// Wer war diese erstaunliche Schönheit?
			// Nicht für eine Sekunde dachte er, dass das seine Verlobte sein könnte.
			// Varad hingegen war die aufflammende Begierde in seinen Augen gleichgültig.
			// Hanna blinzelte und fragte unschuldig: „Hey, sind Sie hier, um ..." Bevor sie ihre Frage beenden konnte, gab Anton das Abholschild seinem Assistenten und unterbrach sie. „Natürlich nicht, kleines Mädchen.
			// Mit dieser widerwärtigen Frau habe ich nichts am Hut." Ungläubig blickte Hanna auf.
			// Welcher Teil ihrer Mutter war widerwärtig?! „Aber, wovon reden Sie?
			// Sind Sie etwa blind?
			// Das tut mir leid." Ihre Worte verunsicherten Anton einen Moment.
			// Varad nutzte die Gelegenheit zur Flucht und eilte mit Hanna an der Hand davon.
			// Anton wollte ihr hinterherrennen, aber sein Assistent hielt ihn auf. „Herr Peters, vergessen Sie nicht die Anweisungen Ihres Großvaters.
			// Geduld heißt die Devise " Anton rollte mit den Augen und schaute wehmütig den beiden hinterher. - In der Präsidentensuite des Forster Plaza, einem Hotel der Forster Gruppe, scrollte Varad durch ihr Handy, nachdem sie Hanna ins Bett gebracht hatte.
			// Bereits sieben oder acht verpasste Anrufe von ihrer Familie tauchten nacheinander auf.
			// Als erstes hörte sie die Nachricht von ihrem Vater ab. „Varad verdammt, was machst du denn?!
			// Warum nimmst du nicht ab?
			// Du warst doch diejenige, die diesen ganzen Wirbel um die Auflösung der Verlobung gemacht hat!
			// Komm her und hör auf unsere Zeit verschwenden.
			// Deine jüngere Schwester und Anton haben etwas Gutes am Laufen.
			// Ruiniere das bloß nicht!" [MUSIC: threatening music] Eine Trennung von den Peters kam für Varads Vater nicht infrage, nicht nachdem er die Verbindung zu einer so angesehenen Familie hergestellt und dadurch enormes Ansehen erlangt hatte.
			// In seinen Augen war Varad das schwarze Schaf, sie war an allem Schuld und er musste es ausbaden.
			// Also musste eine Lösung her.
			// Varad Halbschwester Clara war Lückenbüßer.
			// Die beiden Familien hatten endlich eine Einigung erzielt und Varads Vater war zufrieden.`,
			// 							id: "0f017171-4d24-4984-bfbc-75242bd4e020"
			// 						}
			// 					] as TGenerateBeatsheetResponse),
			// 				],
			// 			}))
			// 			// test end

			const timeoutId = setTimeout(() => {
				const timeoutCallback = timeoutCallbacksRef.current[taskId]
				if (timeoutCallback) {
					timeoutCallback(taskId)
				}

				setTaskEnded((prev) => ({ ...prev, [taskId]: true }))
				setTasksTimedOut((prev) => new Set([...prev, taskId]))
				blockedTasksRef.current[taskId] = true
				delete timeoutsRef.current[taskId]
				delete taskCallbacksRef.current[taskId]
				delete timeoutCallbacksRef.current[taskId]
			}, SOCKET_STREAMING_TIMEOUT)

			timeoutsRef.current[taskId] = timeoutId

			return taskId
		},
		[fetchedData, session, socket]
	)

	const stopTask = useCallback((taskId: string) => {
		blockedTasksRef.current[taskId] = true
		setTaskEnded((prev) => ({ ...prev, [taskId]: true }))
		setResponses((prev) => ({ ...prev, [taskId]: [] }))
		responsesRef.current[taskId] = []

		if (timeoutsRef.current[taskId]) {
			clearTimeout(timeoutsRef.current[taskId])
			delete timeoutsRef.current[taskId]
		}
		delete taskCallbacksRef.current[taskId]
		delete timeoutCallbacksRef.current[taskId]
	}, [])

	const getStreamedResponse = useCallback(
		(taskId: string) => {
			return new Promise<string[]>((resolve) => {
				const interval = setInterval(() => {
					if (taskEnded[taskId]) {
						clearInterval(interval)
						resolve(responses[taskId] || [])
					}
				}, 500)
			})
		},
		[responses, taskEnded]
	)

	const getStreamedResponseChunks = useCallback(
		(taskId: string) => {
			return responses[taskId] || []
		},
		[responses]
	)

	return (
		<SocketStreamingContext.Provider
			value={{
				startTask,
				getStreamedResponse,
				getStreamedResponseChunks,
				stopTask,
				responses,
				taskEnded,
				tasksTimedOut,
			}}
		>
			{children}
		</SocketStreamingContext.Provider>
	)
}

const useSocketStreaming = () => {
	const context = useContext(SocketStreamingContext)
	if (!context) {
		throw new Error('useSocket must be used within a SocketProvider')
	}
	return context
}

export default useSocketStreaming
