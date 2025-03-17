import {
	PRIMARY_KEYS_TO_COMPARE,
	PROPS_KEYS_TO_COMPARE,
} from '@/constants/episodes-constants'
import { roleToData } from '@/constants/global-constants'
import { parse } from 'best-effort-json-parser'
import { cva } from 'class-variance-authority'
import { clsx, type ClassValue } from 'clsx'
import { jsonrepair } from 'jsonrepair'
import { twMerge } from 'tailwind-merge'

import { ERole } from '@/types/admin-types'
import { BASE_STATUS, EStatus, STATUS_ORDER } from '@/types/common'
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

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export const getSelectedEpisode = (
	data: TGetEpisodesResponse,
	selectedStatus?: EStatus
): { episode: TEpisode; latestStatus: EStatus | typeof BASE_STATUS } => {
	const prioritizedStatuses = [
		EStatus.PUBLISHED,
		EStatus.POLISH,
		EStatus.SECOND_DRAFT,
		EStatus.FIRST_DRAFT,
	]

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
			if (selectedEpisode) break
		}
	}

	const latestStatus =
		prioritizedStatuses.find((status) =>
			data.results.data.some((episode) => episode.status === status)
		) ?? data.results.data[0].status

	return { episode: selectedEpisode ?? data.results.data[0], latestStatus }
}

export function prettifyNumber(
	num: number,
	locale: string = 'de-DE', // 'en-US' for English
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
	if (!str) return ''
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
	// if (process.env.NODE_ENV === 'production') return
	console.dir(data, { depth: null })
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
	if (!userRole || !roleToData[userRole]) return false
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
	if (!data) return convertedData
	for (const key in data.data) {
		const records = data.data[key]
		const latestData = getLatestStatusData(records)
		convertedData.data[key] = latestData
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
