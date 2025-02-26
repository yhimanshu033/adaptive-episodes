import type { Decorate } from '@udecode/plate-common'
import { isText } from '@udecode/plate-common'
import type { Range } from 'slate'

import { type FindReplaceConfig } from '@/lib/plate/plugins/find-replace/FindReplacePlugin'
import { generateGenitives } from '@/lib/utils/helpers'

export const decorateFindReplace: Decorate<FindReplaceConfig> = ({
	entry: [node, path],
	type,
	getOption,
}) => {
	const search = getOption('search') || ''
	const caseSensitive = getOption('caseSensitive') || false
	const wholeWord = getOption('wholeWord') || false
	const genitive = getOption('genitive') || false

	const ranges: SearchRange[] = []

	if (!search || !isText(node)) {
		return ranges
	}

	const { text } = node
	const regex = new RegExp(
		wholeWord
			? `(\\b${genitive ? generateGenitives(search) + "'?|\\b" : ''}${search}\\b)`
			: `(${search})`,
		caseSensitive ? 'g' : 'gi'
	)
	const parts = text.split(regex)
	let offset = 0
	let searchWord = ''
	return parts.reduce<SearchRange[]>((acc, part, i) => {
		if (i % 2 === 0) {
			if (i !== 0) {
				acc.push({
					anchor: { offset: offset - searchWord.length, path },
					focus: { offset, path },
					search: searchWord,
					[type]: true,
					id: [...path, acc.length],
				})
			}
			searchWord = parts[i + 1] ?? search
			offset = offset + part.length + searchWord.length
		}
		return acc
	}, ranges)
}

type SearchRange = {
	id: number[]
	search: string
} & Range
