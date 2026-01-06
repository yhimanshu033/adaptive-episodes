import type { Decorate } from 'platejs'
import { ElementApi, TextApi } from 'platejs'
import type { Range } from 'slate'

import { type FindReplaceConfig } from '@/lib/plate/plugins/find-replace/FindReplacePlugin'
import { getFindReplaceRegex } from '@/lib/utils/ai-chatbot'

export const decorateFindReplace: Decorate<FindReplaceConfig> = ({
	entry: [node, path],
	type,
	getOption,
}) => {
	const search = getOption('search') || ''
	const caseSensitive = getOption('caseSensitive') || false
	const wholeWord = getOption('wholeWord') || false
	const genitive = getOption('genitive') || false

	if (
		!(
			search &&
			ElementApi.isElement(node) &&
			search.trim().length &&
			node.children.every(TextApi.isText)
		)
	) {
		return []
	}

	const regex = getFindReplaceRegex({
		caseSensitive,
		genitive,
		search,
		wholeWord,
	})

	const texts = node.children.map((it) => it.text)
	const str = texts.join('')

	const matches: { length: number; match: string; start: number }[] = []
	let match: RegExpExecArray | null

	// Reset regex lastIndex to ensure we start from the beginning
	regex.lastIndex = 0

	while ((match = regex.exec(str)) !== null) {
		matches.push({
			length: match[0].length,
			match: match[0],
			start: match.index,
		})

		// Prevent infinite loop for zero-length matches
		if (match[0].length === 0) {
			regex.lastIndex++
		}
	}

	if (matches.length === 0) {
		return []
	}

	const ranges: SearchRange[] = []
	let cumulativePosition = 0
	let matchIndex = 0 // index in the matches array

	for (const [textIndex, text] of texts.entries()) {
		const textStart = cumulativePosition
		const textEnd = textStart + text.length

		// Process matches that overlap with the current text node
		while (matchIndex < matches.length && matches[matchIndex].start < textEnd) {
			const match = matches[matchIndex]
			const matchStart = match.start
			const matchEnd = matchStart + match.length

			// If the match ends before the start of the current text, move to the next match
			if (matchEnd <= textStart) {
				matchIndex++

				continue
			}

			// Calculate overlap between the text and the current match
			const overlapStart = Math.max(matchStart, textStart)
			const overlapEnd = Math.min(matchEnd, textEnd)

			if (overlapStart < overlapEnd) {
				const anchorOffset = overlapStart - textStart
				const focusOffset = overlapEnd - textStart

				// Corresponding offsets within the matched string
				const searchOverlapStart = overlapStart - matchStart
				const searchOverlapEnd = overlapEnd - matchStart

				const textNodePath = [...path, textIndex, matchIndex]

				ranges.push({
					anchor: {
						offset: anchorOffset,
						path: textNodePath,
					},
					focus: {
						offset: focusOffset,
						path: textNodePath,
					},
					search: match.match.slice(searchOverlapStart, searchOverlapEnd),
					[type]: true,
					id: textNodePath,
				})
			}
			// If the match ends within the current text, move to the next match
			if (matchEnd <= textEnd) {
				matchIndex++
			} else {
				// The match continues in the next text node
				break
			}
		}

		cumulativePosition = textEnd
	}

	return ranges
}

type SearchRange = {
	id: number[]
	search: string
} & Range
