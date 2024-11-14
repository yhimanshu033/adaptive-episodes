import { TDescendant, Value } from '@udecode/plate-common'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

import { EStatus, MinifiedValue } from '@/types/common'
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

export const minify = (children: Value): MinifiedValue => {
	const traverse = (nodes: TDescendant[], path: number[]): MinifiedValue => {
		return nodes.flatMap((node, index) => {
			const currentPath = [...path, index]
			if ('text' in node) {
				return [{ id: currentPath.join('_'), text: String(node.text) }]
			} else if ('children' in node) {
				return traverse(node.children, currentPath)
			}
			return []
		})
	}

	return traverse(children, [])
}

export const maxify = (minified: MinifiedValue, children: Value): Value => {
	const applyText = (nodes: TDescendant[], path: number[]): TDescendant[] => {
		return nodes.map((node, index) => {
			const currentPath = [...path, index]

			if ('text' in node) {
				const matchingValue = minified.find(
					(item) => item.id === currentPath.join('_')
				)
				if (matchingValue) {
					return {
						...node,
						text: matchingValue.text,
					}
				}
				return node
			} else if ('children' in node) {
				return {
					...node,
					children: applyText(node.children, currentPath),
				}
			}
			return node
		})
	}

	return children.map((child, index) => ({
		...child,
		children: applyText(child.children, [index]),
	}))
}
