import React from 'react'
import { useEditorState } from '@udecode/plate-common/react'

import { getText, prettifyNumber } from '@/lib/utils'

type WritingStats = {
	averageSentenceLength: number
	averageWordLength: number
	characterCount: number
	characterCountWithoutSpaces: number
	paragraphCount: number
	sentenceCount: number
	wordCount: number
}

function getWritingStats(input: string): WritingStats {
	const paragraphs = input.split(/\n+/).filter((p) => p.trim().length > 0)
	const sentences = input
		.split(/(?<=[.!?])\s+/)
		.filter((s) => s.trim().length > 0)
	const words = input
		.split(/\s+/)
		.filter((w) => w.trim().length > 0 && /^[^\d\s]+$/.test(w))
	const characters = input.replace(/\s+/g, '')

	return {
		wordCount: words.length,
		paragraphCount: paragraphs.length,
		sentenceCount: sentences.length,
		averageSentenceLength: sentences.length
			? words.length / sentences.length
			: 0,
		averageWordLength: words.length
			? words.reduce((sum, word) => sum + word.length, 0) / words.length
			: 0,
		characterCount: input.length,
		characterCountWithoutSpaces: characters.length,
	}
}

export default function WordCount() {
	const { children } = useEditorState()
	const text = getText(children)
	const stats = getWritingStats(text)
	return (
		<div className="flex flex-col gap-4 p-4">
			<h2 className="text-lg font-bold">Word Count</h2>
			<div className="flex flex-col">
				<p>
					<strong>Words:</strong> {prettifyNumber(stats.wordCount)}
				</p>
				<p>
					<strong>Paragraphs:</strong> {prettifyNumber(stats.paragraphCount)}
				</p>
				<p>
					<strong>Sentences:</strong> {prettifyNumber(stats.sentenceCount)}
				</p>
				<p>
					<strong>Average Sentence Length:</strong>{' '}
					{prettifyNumber(Math.ceil(stats.averageSentenceLength))}
				</p>
				<p>
					<strong>Average Word Length:</strong>{' '}
					{prettifyNumber(Math.ceil(stats.averageWordLength))}
				</p>
				<p>
					<strong>Characters:</strong> {prettifyNumber(stats.characterCount)}
				</p>
				<p>
					<strong>{'Characters (no spaces):'}</strong>{' '}
					{prettifyNumber(stats.characterCountWithoutSpaces)}
				</p>
			</div>
		</div>
	)
}
