import { NextRequest } from 'next/server'
import {
	PRIMARY_KEYS_TO_COMPARE,
	prioritizedStatuses,
	PROPS_KEYS_TO_COMPARE,
} from '@/constants/episodes-constants'
import { API_URLS, roleToData } from '@/constants/global-constants'
import { MANAGE_PROJECT } from '@/constants/route-constants'
import { Locale } from '@/i18n/config'
import { match } from '@formatjs/intl-localematcher'
import { parse } from 'best-effort-json-parser'
import { cva } from 'class-variance-authority'
import { clsx, type ClassValue } from 'clsx'
import { jsonrepair } from 'jsonrepair'
import Negotiator from 'negotiator'
import { Session } from 'next-auth'
import { twMerge } from 'tailwind-merge'

import { ERole, SessionData, UserProject } from '@/types/admin-types'
import {
	BASE_STATUS,
	EEpisodeType,
	ELanguage,
	ELSMappingGender,
	ELSMappingType,
	EStatus,
	LSMappingInput,
	LSMappingOutput,
	LSMappingOutputItem,
	STATUS_ORDER,
} from '@/types/common'
import {
	TGetMetadataAPIResponse,
	TGetMetadataResponse,
	TMetadata,
} from '@/types/content-types'
import {
	SaveEpisodeParams,
	TEpisode,
	TGetEpisodeResponse,
	TGetEpisodesResponse,
} from '@/types/episode-type'
import { TGetStoriesResponse } from '@/types/story-types'

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export const getSelectedEpisode = (
	data: TGetEpisodesResponse,
	selectedStatus?: EStatus
): {
	episode: TEpisode
	language: ELanguage
	latestStatus: EStatus | typeof BASE_STATUS
} => {
	let selectedEpisode: TEpisode | undefined

	if (selectedStatus) {
		selectedEpisode = data.results.data.find(
			(episode) => episode.status === selectedStatus
		)
	}

	if (!selectedEpisode) {
		for (const status of prioritizedStatuses) {
			selectedEpisode = data.results.data.find(
				(episode) => episode.status === status
			)
			if (selectedEpisode) {
				break
			}
		}
	}

	const latestStatus =
		prioritizedStatuses.find((status) =>
			data.results.data.some((episode) => episode.status === status)
		) ?? data.results.data[0]?.status

	return {
		episode: selectedEpisode ?? data.results.data[0],
		latestStatus,
		language: data?.results?.data?.[0]?.language as ELanguage,
	}
}

export const getSelectedEpisodeFromLanguage = (
	data: TGetEpisodesResponse,
	selectedLanguage?: ELanguage
): {
	episode: TEpisode
	language: ELanguage
	latestStatus: EStatus | typeof BASE_STATUS
} => {
	const originalChapter = data.results.data.find(
		(ep) =>
			ep.type === EEpisodeType.ORIGINAL || ep.type === EEpisodeType.INVENTED
	) as TEpisode

	if (!selectedLanguage) {
		return {
			episode: originalChapter,
			language: originalChapter?.language as ELanguage,
			latestStatus: BASE_STATUS,
		}
	}

	const langChapter = data.results.data.find(
		(ep) => ep.language === selectedLanguage
	) as TEpisode

	return {
		episode: langChapter || originalChapter || data.results.data[0],
		language: selectedLanguage,
		latestStatus: BASE_STATUS,
	}
}

export function getAvailableLanguages(
	data: TGetEpisodesResponse | null | undefined
) {
	if (!data) {
		return []
	}
	const episodes = data.results.data

	const languages = Array.from(
		episodes.reduce(
			(acc, curr) => {
				if (curr.language) {
					acc.add(curr.language)
				}
				return acc
			},
			new Set([] as ELanguage[])
		)
	)

	return languages
}

export function getDisabledAvailableLanguages(
	data: TGetEpisodesResponse | null | undefined
) {
	if (!data) {
		return []
	}
	const episodes = data.results.data

	const languages = Array.from(
		episodes.reduce(
			(acc, curr) => {
				if (curr.language && !curr.file_url) {
					acc.add(curr.language)
				}
				return acc
			},
			new Set([] as ELanguage[])
		)
	)

	return languages
}
export function prettifyNumber(
	num: number,
	locale: string = 'de', // 'en-US' for English
	options?: Intl.NumberFormatOptions
): string {
	return new Intl.NumberFormat(locale, options).format(num)
}

export function extractBetweenTags(input: string, tagName: string): string {
	const openingTag = `<${tagName}>`
	const closingTag = `</${tagName}>`

	let result = ''
	let startIndex = input.indexOf(openingTag)

	while (startIndex !== -1) {
		const endIndex = input.indexOf(closingTag, startIndex)
		if (endIndex === -1) {
			break
		}

		const content = input
			.substring(startIndex + openingTag.length, endIndex)
			.trim()
		if (content) {
			result += (result ? '\n' : '') + content
		}

		startIndex = input.indexOf(openingTag, endIndex + closingTag.length)
	}

	return result
}

export function extract(str: string) {
	return (
		extractBetweenTags(extractBetweenTags(str, 'answer'), 'text').trim() ||
		extractBetweenTags(str, 'text').trim()
	)
}

export function parseOptimistically<T>(input: string) {
	try {
		return parse(input) as T
	} catch (e) {
		console.log(e)
		try {
			const repaired = jsonrepair(input)
			return parse(repaired) as T
		} catch (e) {
			console.log(e)
			return null
		}
	}
}

export function trim(str: string, length: number = 100) {
	if (str.length <= length) {
		return str
	}
	return str.slice(0, length).trim() + '...'
}

export const getMetaDataRange = (
	currEpisode: number,
	totalEpisodes: number
) => {
	const range = 10
	const end = Math.min(Math.max(range, currEpisode + range / 2), totalEpisodes)
	const start = Math.min(
		Math.max(1, currEpisode - range / 2 + 1),
		Math.max(totalEpisodes - range + 1, 1)
	)
	return [start, end]
}

export const toPascalCase = (str: string | null) => {
	if (!str) {
		return ''
	}
	return str.replace(
		/\w+/g,
		(w) => w[0].toUpperCase() + w.slice(1).toLowerCase()
	)
}

export function getWords(str: string) {
	return str
		.split(/\s+/)
		.filter((w) => w.trim().length > 0 && /^[^\d\s]+$/.test(w))
}

export const buttonVariants = cva(
	'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
	{
		variants: {
			variant: {
				default: 'bg-primary text-primary-foreground hover:bg-primary/90',
				destructive:
					'bg-destructive text-destructive-foreground hover:bg-destructive/90',
				outline:
					'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
				secondary:
					'bg-secondary text-secondary-foreground hover:bg-secondary/80',
				ghost: 'hover:bg-accent hover:text-accent-foreground',
				link: 'text-primary underline-offset-4 hover:underline',
			},
			size: {
				default: 'h-10 px-4 py-2',
				sm: 'h-9 rounded-md px-3',
				lg: 'h-11 rounded-md px-8',
				icon: 'size-10',
			},
		},
		defaultVariants: {
			variant: 'default',
			size: 'default',
		},
	}
)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function log(data: any) {
	if (process.env.NODE_ENV === 'production') {
		return
	}
	console.dir(data, { depth: null })
}

export function getDifferingKeys(
	obj1: SaveEpisodeParams,
	obj2: SaveEpisodeParams
): string[] {
	const unmatchedKeys: string[] = []
	PRIMARY_KEYS_TO_COMPARE.forEach((key) => {
		if (JSON.stringify(obj1[key]) !== JSON.stringify(obj2[key])) {
			unmatchedKeys.push(key)
		}
	})
	PROPS_KEYS_TO_COMPARE.forEach((key) => {
		if (
			JSON.stringify(obj1['props']?.[key]) !==
			JSON.stringify(obj2['props']?.[key])
		) {
			unmatchedKeys.push(key)
		}
	})
	return unmatchedKeys
}

export function getEpisodeQueryResponseFromStoredData({
	episodeData,
	oldData,
}: {
	episodeData: TGetEpisodeResponse
	oldData: SaveEpisodeParams
}): TGetEpisodeResponse {
	return {
		...episodeData,
		text: oldData.text,
		chapter: {
			...episodeData.chapter,
			props: oldData.props,
			chapter_title: oldData.chapter_title || episodeData.chapter.chapter_title,
		},
	}
}

export function getSavedParamsFromEpisodeData(data: TGetEpisodeResponse) {
	return {
		projectId: data.chapter.project,
		status: data.chapter.status,
		episodeId: Number(data.chapter.parent || data.chapter.id),
		text: data.text,
		props: data.chapter.props,
		chapter_title: data?.chapter?.chapter_title,
	}
}

export function isAuthorized({
	requiredRole,
	userRole,
}: {
	requiredRole: ERole
	userRole: ERole | null
}) {
	if (!userRole || !roleToData[userRole]) {
		return false
	}
	return roleToData[userRole].priority <= roleToData[requiredRole].priority
}

export function getLatestStatusData(
	data: TGetMetadataAPIResponse['data']['string']
): TMetadata {
	for (const status of STATUS_ORDER) {
		if (data[status]) {
			return data[status]
		}
	}
	return {
		beatsheet: '',
		context: '',
		loglines: '',
		summary: '',
		chapter_title: '',
	}
}

export function convertMetadata(
	data: TGetMetadataAPIResponse | null
): TGetMetadataResponse {
	const convertedData: TGetMetadataResponse = {
		data: {},
	}
	if (!data) {
		return convertedData
	}
	for (const key in data.data) {
		const records = data.data[key]
		const latestData = getLatestStatusData(records)
		convertedData.data[key] = latestData
	}

	const keys = Object.keys(convertedData.data)
	// Check if logline exists and assign it to loglines
	for (const key of keys) {
		const data = convertedData.data[key]
		if (!data.loglines && data.logline) {
			data.loglines = data.logline
		}
	}
	return convertedData
}

export function stringToHexColor(str: string): string {
	let hash = 0
	for (let i = 0; i < str.length; i++) {
		hash = str.charCodeAt(i) + ((hash << 5) - hash)
	}

	let color = '#'
	for (let i = 0; i < 3; i++) {
		let value = (hash >> (i * 8)) & 0xff

		// Ensure it's dark enough (avoiding very light colors)
		value = Math.min(180, value)
		color += value.toString(16).padStart(2, '0')
	}

	return color
}

export const buildQueryString = (
	params: Record<string, string | number | boolean | undefined | null>
): string => {
	const query = Object.entries(params)
		.reduce<string[]>((acc, [key, value]) => {
			if (value !== undefined && value !== null && value !== '') {
				acc.push(
					`${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`
				)
			}
			return acc
		}, [])
		.join('&')

	return query ? `?${query}` : ''
}

export const generateGenitives = (input: string) => {
	// Handle empty or invalid input
	if (!input || typeof input !== 'string') {
		return input
	}

	// Check if input already has a genitive form
	if (input.endsWith("'s") || input.endsWith("'")) {
		return input
	}

	// For names ending in s, x, z - add apostrophe
	if (/[szx]$/i.test(input)) {
		return input + "'"
	}

	// For all other names - add "s"
	return input + 's'
}

export function downloadBlob(blob: Blob, fileName: string) {
	const url = URL.createObjectURL(blob)
	const a = document.createElement('a')
	a.href = url
	a.download = fileName
	document.body.appendChild(a)
	a.click()
	document.body.removeChild(a)
	URL.revokeObjectURL(url)
}

export async function projectAdminCheck(
	req: NextRequest,
	session: SessionData
) {
	let data: { projects: UserProject[] } | null = null
	try {
		data = (await fetch(
			`${process.env.NEXT_PUBLIC_BACKEND_URL}${API_URLS.GET_USER_PROJECTS}`,
			{
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${session.accessToken}`,
				},
			}
		).then((res) => res.json())) as { projects: UserProject[] }
	} catch (error) {
		console.error('Error fetching user projects:', error)
	}
	const projectId = req.nextUrl.pathname.match(MANAGE_PROJECT)?.[1] || null
	return data && projectId
		? data?.projects?.some(
				(project) =>
					project.project.id === Number(projectId) &&
					project.role === ERole.ADMIN
			)
		: false
}

export function sortOpenedStories(
	openedIds: number[],
	projects: TGetStoriesResponse
) {
	const sortedProjects = [...projects].sort((a, b) => {
		const indexA = openedIds.indexOf(a.id)
		const indexB = openedIds.indexOf(b.id)

		if (indexA === -1 && indexB === -1) {
			return 0
		} // Both not in openedIds, keep relative order
		if (indexA === -1) {
			return 1
		} // A is not in openedIds, move to end
		if (indexB === -1) {
			return -1
		} // B is not in openedIds, move to end

		return indexA - indexB
	})

	return sortedProjects
}

export function getFormattedDate(date?: Date): string {
	const now = date || new Date()
	const day = now.getDate().toString().padStart(2, '0')
	const month = (now.getMonth() + 1).toString().padStart(2, '0') // Months are 0-based
	const year = now.getFullYear().toString()

	return `${day}.${month}.${year}`
}

export function pretifyVoiceXMLData(data: string) {
	const statusRegex = /<status section="(\d+)">(.*?)<\/status>/g
	const sectionRegex = /<section-start id="(\d+)"\/>/g

	const statusMatches = [...data.matchAll(statusRegex)]
	const sectionMatches = [...data.matchAll(sectionRegex)]

	const removeCount = Math.min(statusMatches.length, sectionMatches.length)

	let cleanedData = data

	if (removeCount > 0) {
		for (let i = 0; i < removeCount; i++) {
			cleanedData = cleanedData.replace(statusMatches[i][0], '')
		}
	}
	cleanedData = cleanedData.replace(/<\/?[^>]+\/?>/g, '\n').trim()

	return cleanedData
}

export function speak(value: string) {
	const utterance = new SpeechSynthesisUtterance(value)
	utterance.lang = 'de-DE'
	utterance.rate = 0.8

	speechSynthesis.speak(utterance)
}

export function formatDuration(seconds: number, showHours?: boolean): string {
	const hours = Math.floor(seconds / 3600)
	const minutes = Math.floor((seconds % 3600) / 60)
	const remainingSeconds = Math.floor(seconds % 60)

	const formattedMinutes = minutes.toString().padStart(2, '0')
	const formattedSeconds = remainingSeconds.toString().padStart(2, '0')

	if (hours > 0 || showHours) {
		const formattedHours = hours.toString().padStart(2, '0')
		return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`
	} else {
		return `${formattedMinutes}:${formattedSeconds}`
	}
}

export function handleToolTags(
	responseChunks: string[],
	isRunning: boolean = false
) {
	return responseChunks
		.slice(isRunning ? 0 : 1)
		.join('')
		.replace(/<tool [^>]*>/g, '')
		.replace(/<\/tool>/g, '')
}

export function hasToolResult(responseChunks: string[]) {
	return responseChunks.some((chunk) =>
		/<tool[^>]* status="result">/.test(chunk)
	)
}

function orderLocales<AppLocales extends Locale[]>(locales: AppLocales) {
	// Workaround for https://github.com/formatjs/formatjs/issues/4469
	return locales.slice().sort((a, b) => b.length - a.length)
}

export function getAcceptLanguageLocale<AppLocales extends Locale[]>(
	requestHeaders: Headers,
	locales: AppLocales,
	defaultLocale: Locale
) {
	let locale

	const languages = new Negotiator({
		headers: {
			'accept-language': requestHeaders.get('accept-language') || undefined,
		},
	}).languages()
	try {
		const orderedLocales = orderLocales(locales)
		locale = match(languages, orderedLocales, defaultLocale)
	} catch {
		console.info('invalid language')
	}

	return locale
}

export function splitStringByLength(input: string, maxLen: number): string[] {
	const sentenceRegex = /[^.!?]+[.!?]+["')\]]*\s*/g
	const sentences = input.match(sentenceRegex) || []
	const result: string[] = []
	let currentChunk = ''

	for (const sentence of sentences) {
		const trimmedSentence = sentence.trim()

		if (trimmedSentence.length > maxLen) {
			throw new Error(
				`Sentence "${trimmedSentence}" exceeds the max length of ${maxLen}`
			)
		}

		if (currentChunk.length + trimmedSentence.length + 1 <= maxLen) {
			currentChunk += (currentChunk ? ' ' : '') + trimmedSentence
		} else {
			result.push(currentChunk)
			currentChunk = trimmedSentence
		}
	}

	if (currentChunk) {
		result.push(currentChunk)
	}

	return result
}

export function parseInputLSMapping(input: LSMappingInput) {
	const tableItems: LSMappingOutputItem[] = Object.entries(
		input.ls_mapping
	).map(([key, value]) => ({
		original_name: key,
		localised_name: value['localised_name'] || '',
		type: value.type || ELSMappingType.ENTITY,
		gender: value.gender || ELSMappingGender.MALE,
	}))

	return tableItems
}

export function parseOutputLSMapping(data: LSMappingOutput['ls_mapping']) {
	return data.map((item) => {
		if (item.type !== ELSMappingType.PERSON) {
			delete item.gender
		}
		return item
	})
}

export function isInvalidLSMapping(data: LSMappingOutput['ls_mapping']) {
	return data.some(
		(item) =>
			!item.original_name.trim() ||
			!item.localised_name.trim() ||
			!item.type ||
			(item.type === ELSMappingType.PERSON && !item.gender)
	)
}

export function isInternalUser(session: Session | null) {
	// return false
	return !!session && session.user.email.includes('@pocketfm')
}
