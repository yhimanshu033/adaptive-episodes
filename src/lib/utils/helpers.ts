import {
	AVAILABLE_TARGET_LANGUAGES,
	LSMappingTabs,
} from '@/constants/ai-constants'
import {
	beatSheetEditorAllowedProjects,
	DEFAULT_NAVIGATION_PAGE_LIMIT,
} from '@/constants/editor-constants'
import {
	PRIMARY_KEYS_TO_COMPARE,
	prioritizedStatuses,
	PROPS_KEYS_TO_COMPARE,
} from '@/constants/episodes-constants'
import { roleToData } from '@/constants/global-constants'
import { EImportStatus } from '@/constants/story-constants'
import { Locale } from '@/i18n/config'
import {
	TOutlinerData,
	TOutlinerTabData,
} from '@/page-builders/plate-editor/sidebar-sections/outliner/lib/types'
import { match } from '@formatjs/intl-localematcher'
import { parse } from 'best-effort-json-parser'
import { cva } from 'class-variance-authority'
import { clsx, type ClassValue } from 'clsx'
import { formatDistanceToNow } from 'date-fns'
import { jsonrepair } from 'jsonrepair'
import Negotiator from 'negotiator'
import { Session } from 'next-auth'
import { twMerge } from 'tailwind-merge'

import { ERole } from '@/types/admin-types'
import { EMessenger, TMessage, TSimplifiedMessage } from '@/types/ai-types'
import {
	TCharacter,
	TGenerateBeatsheetResponseItem,
	TScene,
	TSceneUpdateBody,
} from '@/types/beatsheet-editor-types'
import {
	BASE_STATUS,
	EEpisodeType,
	ELanguage,
	ELSMappingType,
	EStatus,
	LSMappingInput,
	LSMappingInputItem,
	LSMappingOutputItem,
	LSMappingOutputItemV2,
	LSMappingSequenceData,
	LSMappingSequenceField,
	STATUS_ORDER,
} from '@/types/common'
import {
	TGetMetadataAPIResponse,
	TGetMetadataResponse,
	TGetSavingParamsRet,
	TMetadata,
	TSaveEpisodeMutationArgs,
} from '@/types/content-types'
import { TextStats } from '@/types/editor-types'
import {
	SaveEpisodeParams,
	TEpisode,
	TGetChapterCharactersResponse,
	TGetEpisodeResponse,
	TGetEpisodesResponse,
} from '@/types/episode-type'
import { TStory } from '@/types/story-types'

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export const getSelectedEpisode = (
	data: TGetEpisodesResponse,
	selectedStatus?: EStatus,
	language?: ELanguage
): {
	episode: TEpisode
	language: ELanguage
	latestStatus: EStatus | typeof BASE_STATUS
} => {
	let selectedEpisode: TEpisode | undefined
	let chapters = data.results.data
	let selectedLanguage = language

	// IF NO LANGUAGE IS SELECTED --> USE THE ORIGINAL CHAPTER'S LANGUAGE AS SELECTED LANGUAGE
	if (!selectedLanguage) {
		const originalChapter = chapters.find(
			(ep) =>
				ep.type === EEpisodeType.ORIGINAL || ep.type === EEpisodeType.INVENTED
		)
		selectedLanguage = originalChapter?.language || ELanguage.GERMAN_ORIGINAL
	}

	// ONLY SELECT CHAPTERS THAT HAVE SELECTED LANGUAGE
	chapters = chapters.filter((ep) => {
		return ep.language === selectedLanguage
	})

	// IF A STATUS IS SELECTED --> SELECT EPISODE WITH THAT STATUS
	if (selectedStatus) {
		selectedEpisode = chapters.find(
			(episode) => episode.status === selectedStatus
		)
	}

	// IF EPISODE IS NOT SELECTED
	if (!selectedEpisode) {
		// FIND THE EPISODE HAVING THE HIGHEST PRIORITY STATUS AND SELECT IT
		for (const status of prioritizedStatuses) {
			selectedEpisode = chapters.find((episode) => episode.status === status)
			if (selectedEpisode) {
				break
			}
		}
	}

	// BASE CASE IF STILL NO EPISODE IS SELECTED, LET THE FIRST EP BE SELECTED
	if (!selectedEpisode) {
		selectedEpisode = chapters[0] || data.results.data[0]
	}

	// FIND THE HIGHEST AVAILABLE STATUS FOR SELECTED LANGUAGE CHAPTERS
	const latestStatus = prioritizedStatuses.find((status) => {
		return chapters.some((episode) => episode.status === status)
	})

	return {
		episode: selectedEpisode,
		latestStatus: latestStatus ?? selectedEpisode?.status, // BASE CASE THAT SELECTED EPISODE'S STATUS IS LATEST
		language: selectedEpisode?.language as ELanguage,
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
		text: oldData.text || episodeData.text,
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

export function prettifyVoiceXMLData(data: string) {
	const statusRegex = /<status section="(\d+)">(.*?)<\/status>/g
	const sectionRegex = /<section-start id="(\d+)"\/>/g
	const completedRegex = /<complete\/>/g

	const statusMatches = [...data.matchAll(statusRegex)]
	const sectionMatches = [...data.matchAll(sectionRegex)]

	const removeCount = Math.min(statusMatches.length, sectionMatches.length)

	let cleanedData = data

	if (removeCount > 0) {
		for (let i = 0; i < removeCount; i++) {
			cleanedData = cleanedData.replace(statusMatches[i][0], '')
		}
	}
	cleanedData = cleanedData.replace(completedRegex, '')
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
		locale = defaultLocale
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

export function sortInputLSMapping(
	input: LSMappingOutputItemV2
): LSMappingOutputItemV2 {
	const sheets = Object.keys(input)
	for (const sheet of sheets) {
		const items = input[sheet]
		input[sheet] = items.sort((a, b) => {
			const aIdValue = a['ID'] || a['id'] || a['Id']
			const bIdValue = b['ID'] || b['id'] || b['Id']
			const aTypeValue = a['TYPE'] || a['type'] || a['Type']
			const bTypeValue = b['TYPE'] || b['type'] || b['Type']

			if (aIdValue && bIdValue) {
				// sort by first splitting _ and then aSplit[0]<bSplit[0] would be first and after that Number(aSplit[1])<Number(bSplit[1]) would come first
				const [aPrefix = '', aNum = ''] = String(aIdValue).split('_')
				const [bPrefix = '', bNum = ''] = String(bIdValue).split('_')

				if (aPrefix !== bPrefix) {
					return aPrefix.localeCompare(bPrefix)
				}

				return Number(aNum) - Number(bNum)
			}

			if (aTypeValue && bTypeValue) {
				// reverse sort by aTypeValue and bTypeValue
				return String(bTypeValue).localeCompare(String(aTypeValue))
			}

			// default
			return 0
		})
	}
	return input
}

export function parseInputLSMapping(input: LSMappingInput): {
	data: LSMappingOutputItemV2
	sequence?: LSMappingSequenceData['sequence_ls']
} {
	const parsedInput = Object.fromEntries(
		Object.entries(input.ls_mapping).map(([section, items]) => {
			if (section === LSMappingSequenceField) {
				return [section, items]
			}
			return [
				section,
				Object.entries(items).map(([original_name, item]) => ({
					original_name,
					...item,
				})),
			]
		})
	) as {
		[LSMappingSequenceField]: LSMappingSequenceData['sequence_ls']
	} & LSMappingOutputItemV2

	const { sequence_ls: sequence, ...rest } = parsedInput

	return { data: sortInputLSMapping(rest), sequence }
}

export function parseOutputLSMapping(data: Partial<LSMappingOutputItem[]>) {
	return data.map((item) => {
		if (item?.type !== ELSMappingType.PERSON) {
			delete item?.gender
		}
		return item as LSMappingOutputItem
	})
}

export function isInvalidLSMapping(data: Partial<LSMappingOutputItem[]>) {
	return data.some(
		(item) =>
			!item?.original_name?.trim() ||
			!item?.localised_name?.trim() ||
			!item?.type ||
			(item?.type === ELSMappingType.PERSON && !item?.gender)
	)
}

export const migrateOldLSMapping = (
	data?:
		| LSMappingInput
		| {
				ls_mapping: LSMappingInputItem
		  }
		| null
): LSMappingInput | null => {
	if (!data) {
		return null
	}
	const lsKeys = Object.keys(data.ls_mapping)
	if (
		LSMappingTabs.some((tab) =>
			lsKeys.some((key) => key.toLowerCase().trim() === tab)
		)
	) {
		return data as LSMappingInput
	}
	return {
		ls_mapping: {
			[LSMappingTabs[0]]: data.ls_mapping as LSMappingInputItem,
		},
	}
}

export function isInternalUser(session: Session | null) {
	return !!session && isInternalEmail(session.user.email)
}

export function isInternalEmail(email?: string) {
	return !!email?.includes('@pocketfm')
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

export function estimateDocxSizeInBytesFromText(charCount: number): string {
	// Average: 1 KB (1024 bytes) per ~1200 characters
	const avgCharsPerKB = 120
	const bytesPerKB = 1024

	const estimatedSizeBytes = (charCount / avgCharsPerKB) * bytesPerKB

	return formatFileSizeForDocx(Math.round(estimatedSizeBytes))
}

export function estimateDocxSizeWithOverhead(text: string): string {
	// UTF-8 byte length of the text
	const byteLength = text.length

	// Google Docs / Word baseline file size for any .docx (~35 KB)
	const baseOverhead = 35_000

	// Extra XML wrapping per character (nearly negligible compared to base)
	const perCharOverhead = 0.1 // ~0.1 byte per char after compression

	// Estimate
	const extra = Math.round(byteLength * perCharOverhead)
	const size = baseOverhead + extra

	return formatFileSizeForDocx(size)
}
export function getSavingData(
	params: TGetSavingParamsRet
): TSaveEpisodeMutationArgs {
	return {
		status: params.status,
		chapterId: params.chapterId,
		text: params.text,
		word_count: params.word_count,
		comments: params.allComments,
		prevProps: params.chapterData?.chapter.props,
		language: params.language,
		newLLMMemories: params.llmMemories || {},
	}
}

export const checkForDuplicates = (existingFiles: File[], newFiles: File[]) => {
	const duplicates: string[] = []
	const existingFileMap = new Map(
		existingFiles.map((file) => [`${file.name}-${file.size}`, file])
	)

	newFiles.forEach((newFile) => {
		const fileKey = `${newFile.name}-${newFile.size}`
		if (existingFileMap.has(fileKey)) {
			duplicates.push(newFile.name)
		}
	})

	return duplicates
}

export function hasNWMRan(ep?: TEpisode) {
	if (!ep?.props) {
		return false
	}
	if (beatSheetEditorAllowedProjects.includes(Number(ep.project))) {
		return true
	}
	return 'nwm_running' in ep.props
}

export function parseCSVRow(row: string): string[] {
	const result: string[] = []
	let current = ''
	let inQuotes = false
	let i = 0

	while (i < row.length) {
		const char = row[i]

		if (char === '"') {
			if (inQuotes && row[i + 1] === '"') {
				current += '"'
				i += 2
			} else {
				inQuotes = !inQuotes
				i++
			}
		} else if (char === ',' && !inQuotes) {
			result.push(current.trim())
			current = ''
			i++
		} else {
			current += char
			i++
		}
	}

	result.push(current.trim())
	return result
}

export function parseCSV(text: string): string[][] {
	const rows: string[] = []
	let currentRow = ''
	let inQuotes = false
	let i = 0

	while (i < text.length) {
		const char = text[i]

		if (char === '"') {
			if (inQuotes && text[i + 1] === '"') {
				currentRow += '"'
				i += 2
			} else {
				inQuotes = !inQuotes
				currentRow += char
				i++
			}
		} else if (char === '\n' && !inQuotes) {
			if (currentRow.trim()) {
				rows.push(currentRow)
			}
			currentRow = ''
			i++
		} else {
			currentRow += char
			i++
		}
	}

	if (currentRow.trim()) {
		rows.push(currentRow)
	}

	return rows.map((row) => parseCSVRow(row))
}

export function sanitize<T>(data: T) {
	return JSON.parse(JSON.stringify(data)) as T
}

export function convertChapterCharactersResponse(
	data: TGetChapterCharactersResponse
): TCharacter[] {
	if (!data?.result) {
		return []
	}
	return data.result.map((item, idx) => {
		return {
			...item,
			id: String(idx),
			name: item.canonical_name,
		} as TCharacter
	})
}

export function getSceneIdOrder(newSceneOrder: TScene[]) {
	return newSceneOrder.reduce(
		(acc, curr, currIdx) => {
			return {
				...acc,
				[curr.id]: currIdx,
			}
		},
		{} as Record<string, number>
	)
}
export function shouldTriggerContentReorder(a: TScene[], b: TScene[]): boolean {
	// Compare order
	for (let i = 0; i < a.length; i++) {
		if (a[i].id !== b[i]?.id) {
			return true
		} // order differs
	}
	return false
}

export function isOrderSceneOrderChange(a: TScene[], b: TScene[]) {
	for (let i = 0; i < a?.length; i++) {
		for (let j = 0; j < (a?.[i]?.beats?.length || 0); j++) {
			if (a[i]?.beats?.[j]?.id !== b[i]?.beats?.[j]?.id) {
				return true
			}
		}
	}
	return false
}

export function convertScenesArrayToMap(
	scenes: TScene[]
): Record<string, TScene> {
	return scenes.reduce((acc, curr) => {
		return {
			...acc,
			[curr.id]: curr,
		}
	}, {})
}

/**
 * Randomly shuffles the elements of an array (Fisher–Yates algorithm).
 * Returns a new array — does not modify the original.
 */
export function jumbleArray<T>(array: T[]): T[] {
	const result = [...array] // make a copy so we don't mutate input
	for (let i = result.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1))
		;[result[i], result[j]] = [result[j], result[i]] // swap
	}
	return result
}

export const isStringifiedJsonArray = (text: string) =>
	/^\s*\[.*\]\s*$/.test(text)

export function getContextStr({
	tabData,
	outlinerData,
}: {
	outlinerData?: TOutlinerData
	tabData?: TOutlinerTabData
}) {
	const summary = outlinerData?.[tabData?.summaryIdx ?? -1]
	const scene = summary?.scenes?.[tabData?.sceneIdx ?? -1]
	const beat = scene?.beats?.[tabData?.beatIdx ?? -1]
	let context = 'Summaries'
	if (summary) {
		context = summary.title
	}
	if (scene) {
		context = scene.summary
	}
	if (beat) {
		context = trim(beat.description || '', 15)
	}
	return context
}

export function getSafeArrayIdx(idx: number, len: number) {
	return (len + (idx % len)) % len
}

/**
 * Calculates text statistics including estimated line count based on font and width.
 *
 * @param text - Input text string
 * @param fontSizePx - Font size in pixels (default: 16)
 * @param screenWidthPx - Width of screen/container in pixels (default: 668)
 */
export function getTextStats(
	text: string,
	fontSizePx: number = 16,
	screenWidthPx: number = 668
): TextStats {
	// --- Character count ---
	const charCount = text.length

	// --- Word count ---
	const words = text.trim().split(/\s+/).filter(Boolean)
	const wordCount = words.length

	// --- Sentence count ---
	const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0)
	const sentenceCount = sentences.length

	// --- Line count (approximate based on text wrapping) ---
	// Average character width ≈ 0.5 * fontSize (roughly true for most fonts)
	const avgCharWidth = fontSizePx * 0.5
	const charsPerLine = Math.floor(screenWidthPx / avgCharWidth)

	// Split text into words and simulate wrapping
	let currentLineLength = 0
	let lineCount = 1

	for (const word of words) {
		const wordLength = word.length + 1 // +1 for space
		if (currentLineLength + wordLength > charsPerLine) {
			lineCount++
			currentLineLength = wordLength
		} else {
			currentLineLength += wordLength
		}
	}

	return { wordCount, sentenceCount, lineCount, charCount }
}

export function convertSceneToUpdatePayload(
	scene: TScene,
	sceneIdx: number,
	generatedContent: TGenerateBeatsheetResponseItem,
	episode?: TGetEpisodeResponse | null,
	isNew: boolean = false
) {
	const epId = episode?.chapter?.id || 0
	const projId = episode?.chapter?.project || 0
	const epSeqNo = episode?.chapter.seq_number
	const nwmSceneId = `ep_${epSeqNo}_scene_${sceneIdx + 1}`
	const { charCount, lineCount, sentenceCount, wordCount } = getTextStats(
		generatedContent.content
	)
	const updatedScenePayload: TSceneUpdateBody['scenes'][number] = {
		scene_id: isNew ? undefined : scene.id,
		location: scene.title,
		nwm_scene_id: nwmSceneId,
		beats_count: scene.beats.length,
		chapter_id: epId,
		project_id: projId,
		scene_number: sceneIdx + 1,
		scene_text: generatedContent?.content,
		char_count: charCount,
		line_count: lineCount,
		word_count: wordCount,
		sentence_count: sentenceCount,
		beats: scene.beats.map((item, beatIdx) => {
			return {
				beat_text: item.content || '',
				beat_id: `ep_${epSeqNo}_scene_${sceneIdx + 1}_beat_${beatIdx + 1}`,
			}
		}),
	}
	const updatedScene: TScene = {
		...scene,
		beats: scene.beats.map((item, beatIdx) => {
			return {
				content: item.content || '',
				id: `ep_${epSeqNo}_scene_${sceneIdx + 1}_beat_${beatIdx + 1}`,
			}
		}),
	}
	return { updatedScenePayload, updatedScene }
}

export function getScaledValue(str: string) {
	return `calc(${str}*var(--editor-scale,1))`
}

export function prettifyArrayTrim(arr: number[], len = 4, separator = ', ') {
	return arr.slice(0, len).join(separator)
}

export function getSimplifiedMessageList({
	messages,
	responses,
}: {
	messages: TMessage[]
	responses: Record<string, string[]>
}): TSimplifiedMessage[] {
	const simplified = [...messages].map((item) => {
		if (item.role === EMessenger.ASSISTANT) {
			return {
				role: item.role,
				content:
					(item.taskId ? responses[item.taskId]?.join('') : item.content) || '',
			}
		}
		return {
			content: item.content,
			role: item.role,
		}
	})
	return simplified
}
