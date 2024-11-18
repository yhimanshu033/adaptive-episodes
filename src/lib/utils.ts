import { TDescendant, Value } from '@udecode/plate-common'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

import { EStatus } from '@/types/common'
import { TEpisode, TGetEpisodesResponse } from '@/types/episode-type'

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export function getQueryParam(
	url: string | null | undefined,
	paramName: string
): string | undefined {
	try {
		if (!url) return undefined
		const urlObj = new URL(url)
		return urlObj.searchParams.get(paramName) ?? undefined
	} catch (error) {
		console.error('Invalid URL', error)
		return undefined
	}
}

export const getLatestEpisode = (data: TGetEpisodesResponse): TEpisode => {
	for (const episode of data.results.data) {
		if (episode.status === EStatus.PUBLISHED) {
			return episode
		}
		if (episode.status === EStatus.REOPENED) {
			return episode
		}
		if (episode.status === EStatus.IN_REVIEW) {
			return episode
		}
		if (episode.status === EStatus.AB_TEST) {
			return episode
		}
		if (episode.status === EStatus.SECOND_DRAFT) {
			return episode
		}
		if (episode.status === EStatus.FIRST_DRAFT) {
			return episode
		}
	}
	return data.results.data[0]
}

export function replaceNthInsensitive(
	str: string,
	search: string,
	replace: string,
	nth: number
): string {
	const regex = new RegExp(search, 'gi')
	let matchCount = 0

	return str.replace(regex, (match) => {
		matchCount++
		return matchCount === nth + 1 ? replace : match
	})
}

export function getText(val: Value) {
	let text = ''
	function getTextFromNode(node: TDescendant) {
		if ('text' in node) {
			text += String(node.text)
		} else {
			node.children.forEach(getTextFromNode)
		}
	}
	val.forEach((node, i) => {
		if (i > 0) text += '\n'
		getTextFromNode(node)
	})
	console.log({ text })
	return text
}

export function prettifyNumber(
	num: number,
	locale: string = 'de-DE', // 'en-US' for English
	options?: Intl.NumberFormatOptions
): string {
	return new Intl.NumberFormat(locale, options).format(num)
}
