import { NextRequest } from 'next/server'
import { AVAILABLE_TARGET_LANGUAGES } from '@/constants/ai-constants'
import { DEFAULT_NAVIGATION_PAGE_LIMIT } from '@/constants/editor-constants'
import {
	PRIMARY_KEYS_TO_COMPARE,
	prioritizedStatuses,
	PROPS_KEYS_TO_COMPARE,
} from '@/constants/episodes-constants'
import { API_URLS, roleToData } from '@/constants/global-constants'
import { MANAGE_PROJECT } from '@/constants/route-constants'
import { EImportStatus } from '@/constants/story-constants'
import { Locale } from '@/i18n/config'
import { match } from '@formatjs/intl-localematcher'
import { parse } from 'best-effort-json-parser'
import { cva } from 'class-variance-authority'
import { clsx, type ClassValue } from 'clsx'
import { formatDistanceToNow } from 'date-fns'
import { jsonrepair } from 'jsonrepair'
import Negotiator from 'negotiator'
import { Session } from 'next-auth'
import { twMerge } from 'tailwind-merge'

import { ERole, SessionData, UserProject } from '@/types/admin-types'
import {
	BASE_STATUS,
	EEpisodeType,
	ELanguage,
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
import { TStory } from '@/types/story-types'

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

export function patchBrokenJson(jsonStr: string): string {
	return jsonStr.replace(
		/"match_string"\s*:\s*"(.*?)"}/g,
		(match, p1: string) => {
			if (p1.includes('"')) {
				const safeValue = p1.replace(/"/g, '\\"')
				return `"match_string": "${safeValue}"}`
			}
			return match
		}
	)
}

export function parseOptimistically<T>(input: string) {
	if (!input || input.trim() === '') {
		return null
	}

	const cleanedInput = input.trim()

	try {
		const repaired = jsonrepair(cleanedInput)
		return parse(repaired) as T
	} catch (e) {
		console.log('parse failed:', e)
	}
	try {
		const repaired = jsonrepair(cleanedInput)
		return parse(repaired) as T
	} catch (e) {
		console.log('Jsonrepair failed:', e)
	}
	try {
		const patchedString = patchBrokenJson(cleanedInput)
		const repaired = jsonrepair(patchedString)
		return parse(repaired) as T
	} catch (e) {
		console.log('Patch broken JSON failed:', e)
	}

	// Needs to debug why this is not working
	// try {
	// 	const res = parse(cleanedInput) as T
	// 	return res
	// } catch (e) {
	// 	console.log('Initial parse failed', e)
	// }
	return null
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
	'font-display uppercase *:font-display *:uppercase inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
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
	// the data does not have any status as a key
	return data as unknown as TMetadata
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

export function sortOpenedStories(openedIds: number[], projects: TStory[]) {
	const sortedProjects = [...projects].sort((a, b) => {
		// Check if either story has "Importing" status
		const aIsImporting = a.status === EImportStatus.IMPORTING
		const bIsImporting = b.status === EImportStatus.IMPORTING

		// If one is importing and the other isn't, prioritize the importing one
		if (aIsImporting && !bIsImporting) {
			return -1 // A comes first
		}
		if (!aIsImporting && bIsImporting) {
			return 1 // B comes first
		}

		// If both are importing or both are not importing, apply original logic
		const indexA = openedIds.indexOf(a.id)
		const indexB = openedIds.indexOf(b.id)

		if (indexA === -1 && indexB === -1) {
			return 0 // Both not in openedIds, keep relative order
		}
		if (indexA === -1) {
			return 1 // A is not in openedIds, move to end
		}
		if (indexB === -1) {
			return -1 // B is not in openedIds, move to end
		}

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
	cleanedData = cleanedData
		.replace(/<\/?(?:status|section-)[^>]*\/?>/g, '\n')
		.trim()

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
		.replace(/<answer[^>]*>/g, '')
		.replace(/<\/answer>/g, '')
		.replace(/<text[^>]*>/g, '')
		.replace(/<\/text>/g, '')
		.replace(/\{'model_id':[^}]*\}/g, '')
}

export function handleToolTagsArray(
	responseChunks: string[],
	isRunning: boolean = false
) {
	const concatenated = handleToolTags(responseChunks, isRunning)
	const newChunks = [...responseChunks]
	newChunks.pop()
	const concatenatedPrev = handleToolTags(newChunks, isRunning)
	const concatenatedNext = concatenated.slice(concatenatedPrev.length)
	return [concatenatedPrev, concatenatedNext]
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
		...value,
	}))

	return tableItems
}

export function parseOutputLSMapping(
	data: Partial<LSMappingOutput['ls_mapping']>
) {
	return data.map((item) => {
		if (item?.type !== ELSMappingType.PERSON) {
			delete item?.gender
		}
		return item as LSMappingOutputItem
	})
}

export function isInvalidLSMapping(
	data: Partial<LSMappingOutput['ls_mapping']>
) {
	return data.some(
		(item) =>
			!item?.original_name?.trim() ||
			!item?.localised_name?.trim() ||
			!item?.type ||
			(item?.type === ELSMappingType.PERSON && !item?.gender)
	)
}

export function isInternalUser(session: Session | null) {
	return !!session && session.user.email.includes('@pocketfm')
}

export function getPageFromEpisode(
	episode: TEpisode | null | undefined,
	limit = DEFAULT_NAVIGATION_PAGE_LIMIT
) {
	if (!episode) {
		return null
	}
	return Math.ceil(episode?.seq_number / limit) + 1
}

export function getQueryKeysFromObject(obj: Record<string, unknown>) {
	return Object.values(obj).map(String)
}

export function formatRelativeTime(date: Date): string {
	const distance = formatDistanceToNow(date, { addSuffix: true })
	return distance === 'less than a minute ago' ? 'now' : distance
}

export function toSnakeCase(str: string): string {
	return str
		.replace(/[\s-]+/g, '_') // convert spaces and dashes to _
		.replace(/([a-z0-9])([A-Z])/g, '$1_$2') // camelCase → snake_case
		.replace(/([A-Z]+)([A-Z][a-z0-9]+)/g, '$1_$2') // ABBRWord → abbr_word
		.toLowerCase()
		.replace(/__+/g, '_') // remove double underscores
		.replace(/^_+|_+$/g, '') // trim leading/trailing _
}

export function isUpperCase(str: string): boolean {
	return str === str.toUpperCase()
}

export function extractWords(
	input: string,
	charCount: number,
	fromEnd: boolean = false
): string {
	const words = input.trim().split(/\s+/)

	if (fromEnd) {
		let result = ''
		for (let i = words.length - 1; i >= 0; i--) {
			const temp = words[i] + (result ? ' ' + result : '')
			result = temp
			if (result.length > charCount) {
				break
			}
		}
		return result
	} else {
		let result = ''
		for (let i = 0; i < words.length; i++) {
			const temp = result + (result ? ' ' : '') + words[i]
			result = temp
			if (result.length > charCount) {
				break
			}
		}
		return result
	}
}

export function isArrayEqual(arr1: number[], arr2: number[]) {
	return arr1.every((v, i) => v === arr2[i])
}

export const formatFileSize = (bytes: number): string => {
	if (bytes < 1024) {
		return `${bytes} B`
	} else if (bytes < 1024 * 1024) {
		return `${(bytes / 1024).toFixed(2)} KB`
	} else {
		return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
	}
}

export function getSelectableLanguages(
	currentLanguage: ELanguage
): ELanguage[] {
	if (currentLanguage === ELanguage.TRANSLATED_ENGLISH) {
		return [ELanguage.ENGLISH]
	}
	return AVAILABLE_TARGET_LANGUAGES.filter((lang) => lang !== currentLanguage)
}

export function getFirstName(name: string | null | undefined): string {
	if (!name) {
		return ''
	}
	const parts = name.split(' ')
	if (parts.length === 0) {
		return ''
	}
	return parts[0]
}

export function hashString(str: string): number {
	let hash = 5381
	for (let i = 0; i < str.length; i++) {
		hash = (hash * 33) ^ str.charCodeAt(i)
	}
	return hash >>> 0 // ensure positive integer
}

export function getFilenameForSeqNos(seq_nos: number[]): string {
	return 'EP ' + getEpisodeNumbers(seq_nos, 20) + '.docx'
}

export function getEpisodesShortTitle(episodes: TEpisode[]): string {
	if (episodes.length < 1) {
		return '(0 episodes selected)'
	}
	if (episodes.length === 1) {
		return '(EP ' + episodes[0].seq_number + ')'
	}
	return '(EP ' + getEpisodeNumbers(getSeqNumbersFromEpisodes(episodes)) + ')'
}

export function getSeqNumbersFromEpisodes(episodes: TEpisode[]): number[] {
	return episodes.map((item) => item.seq_number).sort()
}

export function getEpisodeNumbers(seqNumbers: number[], maxNum = 5): string {
	if (seqNumbers.length > maxNum) {
		return (
			seqNumbers.slice(0, maxNum - 1).join(',') +
			'...' +
			seqNumbers[seqNumbers.length - 1]
		)
	}
	return seqNumbers.join(',')
}

// Common utility function to format file size
export function formatFileSizeForDocx(sizeInBytes: number): string {
	if (sizeInBytes < 1024) {
		return `${sizeInBytes.toFixed(0)} B`
	} else if (sizeInBytes < 1024 * 1024) {
		const sizeInKB = sizeInBytes / 1024
		return `${sizeInKB.toFixed(2)} KB`
	} else if (sizeInBytes < 1024 * 1024 * 1024) {
		const sizeInMB = sizeInBytes / (1024 * 1024)
		return `${sizeInMB.toFixed(2)} MB`
	} else {
		const sizeInGB = sizeInBytes / (1024 * 1024 * 1024)
		return `${sizeInGB.toFixed(2)} GB`
	}
}

// Helper function to get actual file size from URL with base64 fallback
export async function getFileSizeFromURL(
	url: string,
	text: string
): Promise<string> {
	try {
		const response = await fetch(url, { method: 'HEAD' })
		const contentLength = response.headers.get('content-length')
		if (contentLength) {
			const sizeInBytes = parseInt(contentLength, 10)
			return formatFileSizeForDocx(sizeInBytes)
		}
	} catch (error) {
		console.error(
			'Error getting file size from URL, falling back to base64 calculation:',
			error
		)
		// Fallback to base64 calculation
		return estimateDocxSizeInBytesFromText(text.length)
	}

	// Fallback if no content-length header
	return estimateDocxSizeInBytesFromText(text.length)
}

function estimateDocxSizeInBytesFromText(charCount: number): string {
	// Average: 1 KB (1024 bytes) per ~1200 characters
	const avgCharsPerKB = 120
	const bytesPerKB = 1024

	const estimatedSizeBytes = (charCount / avgCharsPerKB) * bytesPerKB

	return formatFileSizeForDocx(Math.round(estimatedSizeBytes))
}
