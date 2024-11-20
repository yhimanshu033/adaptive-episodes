import type { Decorate } from '@udecode/plate-common'
import { isText } from '@udecode/plate-common'
import type { Range } from 'slate'

import { type FindReplaceConfig } from './FindReplacePlugin'

export const decorateFindReplace: Decorate<FindReplaceConfig> = ({
	entry: [node, path],
	type,
	getOption,
}) => {
	const originalSearch = getOption('search') || ''
	const caseSensitive = getOption('caseSensitive') || false

	const ranges: SearchRange[] = []

	if (!originalSearch || !isText(node)) {
		return ranges
	}

	const { text: originalText } = node
	const text = caseSensitive ? originalText : originalText.toLowerCase()
	const search = caseSensitive ? originalSearch : originalSearch.toLowerCase()
	const parts = text.split(search)
	let offset = 0
	parts.forEach((part, i) => {
		if (i !== 0) {
			ranges.push({
				anchor: { offset: offset - search.length, path },
				focus: { offset, path },
				search,
				[type]: true,
				id: [...path, ranges.length],
			})
		}

		offset = offset + part.length + search.length
	})

	return ranges
}

type SearchRange = {
	id: number[]
	search: string
} & Range
