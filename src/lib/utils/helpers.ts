import { parse } from 'best-effort-json-parser'
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

export function getWords(str: string) {
	return str
		.split(/\s+/)
		.filter((w) => w.trim().length > 0 && /^[^\d\s]+$/.test(w))
}
