import { parse } from 'best-effort-json-parser'
import { cva } from 'class-variance-authority'
import { clsx, type ClassValue } from 'clsx'
import { jsonrepair } from 'jsonrepair'
import { twMerge } from 'tailwind-merge'

import { BASE_STATUS, EStatus } from '@/types/common'
import { TEpisode, TGetEpisodesResponse } from '@/types/episode-type'

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
	return extractBetweenTags(extractBetweenTags(str, 'answer'), 'text')
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
	return [start - 1, end]
}

export const toPascalCase = (str: string | null) => {
	if (!str) return ''
	return str.replace(
		/\w+/g,
		(w) => w[0].toUpperCase() + w.slice(1).toLowerCase()
	)
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
	if (process.env.NODE_ENV === 'production') return
	console.dir(data, { depth: null })
}
