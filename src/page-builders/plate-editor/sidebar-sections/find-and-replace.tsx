import React, { useCallback, useEffect, useMemo, useState } from 'react'
import {
	useEditorPlugin,
	useEditorRef,
	useEditorState,
} from '@udecode/plate-common/react'
import { TElement, TText } from '@udecode/slate'
import {
	CaseSensitive,
	ChevronDown,
	ChevronRight,
	ChevronUp,
	ReplaceAllIcon,
	ReplaceIcon,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Toggle } from '@/components/ui/toggle'
import { FindReplacePlugin } from '@/lib/plate/plugins/find-replace'
import { cn, replaceNthInsensitive } from '@/lib/utils'

export default function FindAndReplace() {
	const { setOptions, useOption } = useEditorPlugin(FindReplacePlugin)

	const search = useOption('search') || ''
	const replace = useOption('replace') || ''
	const replaceEnabled = useOption('replaceEnabled')
	const caseSensitive = useOption('caseSensitive')
	const [ptr, setPtr] = useState(0)

	const editor = useEditorRef()
	const { children } = useEditorState()

	const occurrences = useMemo(() => {
		return children.reduce((acc, node) => {
			const getCount = (node: TElement | TText): number => {
				if ('text' in node) {
					const regex = new RegExp(search, caseSensitive ? 'g' : 'gi')
					const matches = String(node.text).match(regex)
					return matches ? matches.length : 0
				} else if ('children' in node) {
					return node.children.reduce(
						(childAcc, child) => childAcc + getCount(child),
						0
					)
				}
				return 0
			}
			return acc + getCount(node)
		}, 0)
	}, [children, search, caseSensitive])

	const records = useMemo(() => {
		const records: number[][] = []
		children.forEach((node, index) => {
			const getCount = (node: TElement | TText, path: number[]): void => {
				if ('text' in node) {
					const regex = new RegExp(search, caseSensitive ? 'g' : 'gi')
					const matches = String(node.text).match(regex)
					matches?.forEach((m, i) => records.push([...path, i]))
				} else if ('children' in node) {
					node.children.forEach((child, childIndex) =>
						getCount(child, [...path, childIndex])
					)
				}
			}
			getCount(node, [index])
		})
		return records
	}, [children, search, caseSensitive])

	useEffect(() => {
		if (!records[ptr]) return
		setOptions({ currentId: records[ptr] })
		const elem = document.getElementById(
			`search-highlight-${records[ptr].join('-')}`
		)
		if (elem) {
			elem.scrollIntoView({ behavior: 'smooth', block: 'center' })
		}
	}, [ptr, children, records, setOptions])

	useEffect(() => {
		setPtr(0)
	}, [search, caseSensitive])

	function toggleReplace() {
		setOptions({ replaceEnabled: !replaceEnabled })
	}
	const onReplaceAll = useCallback(() => {
		if (!search || !replaceEnabled || !editor) return

		const updatedChildren = structuredClone(children)

		function processNode(node: TElement | TText): void {
			if ('text' in node) {
				if (!replaceEnabled || !search) return
				const regex = new RegExp(search, caseSensitive ? 'g' : 'gi')
				node.text = String(node.text).replace(regex, replace)
			} else if ('children' in node) {
				node.children.forEach(processNode)
			}
		}
		updatedChildren.forEach(processNode)
		editor.tf.setValue(updatedChildren)
		setOptions({ search: '', replace: '', replaceEnabled: false })
	}, [
		caseSensitive,
		children,
		editor,
		replace,
		replaceEnabled,
		search,
		setOptions,
	])

	const onReplace = useCallback(() => {
		const path = records[ptr]
		const updatedChildren = structuredClone(children)
		const node = updatedChildren[path[0]].children[path[1]] as TElement
		const text = replaceNthInsensitive(
			node.text as string,
			search,
			replace,
			path[2]
		)
		updatedChildren[path[0]].children[path[1]] = {
			...node,
			text,
		}
		editor.tf.setValue(updatedChildren)
	}, [children, editor.tf, ptr, records, replace, search])

	function handlePrev() {
		setPtr(ptr > 0 ? ptr - 1 : ptr)
	}

	function handleNext() {
		setPtr(ptr < records.length - 1 ? ptr + 1 : ptr)
	}

	function toggleCaseSensitive() {
		setOptions({ caseSensitive: !caseSensitive })
		const updatedChildren = structuredClone(children)
		editor.tf.setValue(updatedChildren)
	}

	function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
		setOptions({ search: e.target.value })
		const updatedChildren = structuredClone(children)
		editor.tf.setValue(updatedChildren)
	}

	function handleSuggestionClick(suggestion: string) {
		setOptions({ search: suggestion })
		const updatedChildren = structuredClone(children)
		editor.tf.setValue(updatedChildren)
	}

	const characters = ['Alex', 'Cathy', 'Billy', 'Karen']
	const places = [
		'Sheraton New York',
		'Sheraton Hotel',
		'Times Square',
		'First Republic Bank',
		'VIP Lounge',
	]

	const concepts = [
		'Regenmantel',
		'Kondome',
		'Päckchen',
		'Taschentücher',
		'Zimmer 1302',
		'Bademantel',
		'Haar',
		'Duschgel',
		'Schampoo',
		'Geld',
		'Erbe',
		'Luxushotel',
		'Tür',
		'Bank',
		'Karte',
		'Kunden',
		'Vermögen',
		'Tasche',
		'Regentropfen',
		'SMS',
		'VIP-Bereich',
		'Lounge',
	]

	return (
		<div className="flex h-[58vh] flex-col gap-4 p-4">
			<h2 className="text-lg font-bold">Localization</h2>
			<div className="grid grid-cols-[1fr_10fr_2fr] gap-4">
				<Toggle onClick={toggleReplace} aria-label="Toggle replace">
					<ChevronRight
						className={cn('transition-all', replaceEnabled && 'rotate-90')}
					/>
				</Toggle>
				<div className="relative">
					<Input
						value={search}
						onChange={handleSearchChange}
						type="text"
						placeholder="Find"
						className="flex-1 rounded border border-gray-300 p-2"
					/>
					<Toggle
						onClick={toggleCaseSensitive}
						aria-label="Toggle case-sensitivity"
						className="absolute inset-y-0 right-0 my-auto scale-75"
					>
						<CaseSensitive />
					</Toggle>
				</div>
				<div className="flex gap-2">
					<Button onClick={handlePrev} disabled={ptr < 1}>
						<ChevronUp />
					</Button>
					<Button onClick={handleNext} disabled={ptr === records.length - 1}>
						<ChevronDown />
					</Button>
				</div>
				{replaceEnabled && (
					<>
						<Input
							value={replace}
							onChange={(e) => setOptions({ replace: e.target.value })}
							type="text"
							placeholder="Replace with"
							className="col-start-2 flex-1 rounded border border-gray-300 p-2"
						/>
						<div className="flex gap-2">
							<Button title="replace" onClick={onReplace}>
								<ReplaceIcon />{' '}
							</Button>
							<Button title="replace all" onClick={onReplaceAll}>
								<ReplaceAllIcon />{' '}
							</Button>
						</div>
					</>
				)}
			</div>
			{search && (
				<p className="text-lg text-muted-foreground">
					Found <span className="font-bold text-foreground">{occurrences}</span>{' '}
					occurrences of{' '}
					<span className="font-medium italic text-foreground">{search}</span>
				</p>
			)}

			<ScrollArea
				className={cn(
					'flex h-full flex-col overflow-y-auto',
					replaceEnabled ? '~h-[30vh]' : '~h-[37vh]'
				)}
			>
				<h4 className="text-lg font-semibold">Characters</h4>
				<div className="flex flex-wrap gap-2 pt-1">
					{characters.map((character, index) => (
						<Button
							onClick={() => handleSuggestionClick(character)}
							key={index}
							variant="outline"
						>
							{character}
						</Button>
					))}
				</div>
				<h4 className="pt-2 text-lg font-semibold">Places</h4>
				<div className="flex flex-wrap gap-2 pt-1">
					{places.map((character, index) => (
						<Button
							onClick={() => handleSuggestionClick(character)}
							key={index}
							variant="outline"
						>
							{character}
						</Button>
					))}
				</div>
				<h4 className="pt-2 text-lg font-semibold">Concepts</h4>
				<div className="flex flex-wrap gap-2 pt-1">
					{concepts.map((character, index) => (
						<Button
							onClick={() => handleSuggestionClick(character)}
							key={index}
							variant="outline"
						>
							{character}
						</Button>
					))}
				</div>
			</ScrollArea>

			<Button className="w-fit self-end">Scan the Episode</Button>
		</div>
	)
}
