import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { farSearchModes } from '@/constants/editor-constants'
import useLocalizeHook, {
	useLocalizeDownloadMutation,
	useUpdateLOCSheetMutation,
} from '@/hooks/mutation/use-localize-hook'
import {
	useEditorPlugin,
	useEditorRef,
	useEditorState,
} from '@udecode/plate-common/react'
import { TElement, TText } from '@udecode/slate'

import useProjectId from '@/providers/project-id-provider'
import { FindReplacePlugin } from '@/lib/plate/plugins/find-replace'
import { replaceNthInsensitive } from '@/lib/utils/ai-chatbot'
import { downloadFile } from '@/lib/utils/client-helpers'
import { generateGenitives } from '@/lib/utils/helpers'
import { breakDownValue } from '@/lib/utils/plate'

import {
	TLocalizeCharacterArrayItem,
	TLocalizeConceptArrayItem,
	TLocalizeObjectArrayItem,
	TLocalizePlaceArrayItem,
	TLocalizeResponse,
} from '@/types/ai-types'
import { TLocalizationObject } from '@/types/editor-types'

import useLOCSheetData from './query/use-loc-sheet-data'

export default function useFindAndReplace() {
	const { setOptions, useOption } = useEditorPlugin(FindReplacePlugin)

	const search = useOption('search') || ''
	const replace = useOption('replace') || ''
	const replaceEnabled = useOption('replaceEnabled')
	const caseSensitive = useOption('caseSensitive')
	const wholeWord = useOption('wholeWord')
	const genitive = useOption('genitive')
	const [ptr, setPtr] = useState(0)
	const { data: fetchedData, refetch, isFetching } = useLocalizeHook()
	const { isPending, mutateAsync } = useLocalizeDownloadMutation()
	const { isPending: updateLOCPending, mutateAsync: updateLOCMutateAsync } =
		useUpdateLOCSheetMutation()
	const [data, setData] = useState<TLocalizeResponse['result'] | undefined>(
		fetchedData
	)
	const { data: urlData } = useLOCSheetData()
	const sheetURL = urlData ? urlData.loc_sheet_url : ''

	const { isWriter } = useProjectId()

	useEffect(() => {
		setData(fetchedData)
	}, [fetchedData])

	const editor = useEditorRef()
	const { children } = useEditorState()

	const occurrences = useMemo(() => {
		return children.reduce((acc, node) => {
			const getCount = (node: TElement | TText): number => {
				if ('text' in node) {
					const regex = new RegExp(
						wholeWord
							? `(\\b(${genitive ? generateGenitives(search) + "'?|" : ''}${search})(?=\\b|\\W|$))`
							: `(${search})`,
						caseSensitive ? 'g' : 'gi'
					)
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
	}, [children, wholeWord, genitive, search, caseSensitive])

	const records = useMemo(() => {
		const records: number[][] = []
		children.forEach((node, index) => {
			const getCount = (node: TElement | TText, path: number[]): void => {
				if ('text' in node) {
					const regex = new RegExp(
						wholeWord
							? `(\\b(${genitive ? generateGenitives(search) + "'?|" : ''}${search})(?=\\b|\\W|$))`
							: `(${search})`,
						caseSensitive ? 'g' : 'gi'
					)
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
	}, [children, wholeWord, genitive, search, caseSensitive])

	useEffect(() => {
		if (!records[ptr]) return
		setOptions({ currentId: records[ptr] })
		const elem = document.getElementById(
			`search-highlight-${records[ptr].join('-')}`
		)
		if (elem) {
			elem.scrollIntoView({ behavior: 'smooth', block: 'center' })
		}
	}, [ptr, records, setOptions])

	useEffect(() => {
		setPtr(0)
	}, [search, caseSensitive, wholeWord])

	function toggleReplace() {
		setOptions({ replaceEnabled: !replaceEnabled })
	}
	const onReplaceAll = useCallback(() => {
		if (!search || !replaceEnabled || !editor) return

		const updatedChildren = structuredClone(children)

		function processNode(node: TElement | TText): void {
			if ('text' in node) {
				if (!replaceEnabled || !search) return
				const regex = new RegExp(
					wholeWord
						? `(\\b(${genitive ? generateGenitives(search) + "'?|" : ''}${search})(?=\\b|\\W|$))`
						: `(${search})`,
					caseSensitive ? 'g' : 'gi'
				)
				node.text = String(node.text).replace(regex, (match) =>
					match !== search ? generateGenitives(replace) : replace
				)
			} else if ('children' in node) {
				node.children.forEach(processNode)
			}
		}
		updatedChildren.forEach(processNode)
		editor.tf.setValue(breakDownValue(updatedChildren))
		setOptions({ search: '', replace: '', replaceEnabled: false })
	}, [
		search,
		replaceEnabled,
		editor,
		children,
		setOptions,
		wholeWord,
		genitive,
		caseSensitive,
		replace,
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
		editor.tf.setValue(breakDownValue(updatedChildren))
	}, [children, editor.tf, ptr, records, replace, search])

	function handlePrev() {
		setPtr(ptr > 0 ? ptr - 1 : ptr)
	}

	function handleNext() {
		setPtr(ptr < records.length - 1 ? ptr + 1 : ptr)
	}

	function toggleSearchMode(mode: farSearchModes) {
		if (mode === farSearchModes.CASE_SENSITIVE)
			setOptions({ caseSensitive: !caseSensitive })
		else if (mode === farSearchModes.WHOLE_WORD) {
			setOptions({ wholeWord: !wholeWord, genitive: !wholeWord })
		}
		const updatedChildren = structuredClone(children)
		editor.tf.setValue(breakDownValue(updatedChildren))
	}

	function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
		setOptions({ search: e.target.value })
		const updatedChildren = structuredClone(children)
		editor.tf.setValue(breakDownValue(updatedChildren))
	}

	function handleSuggestionClick(
		suggestion:
			| TLocalizeCharacterArrayItem
			| TLocalizeConceptArrayItem
			| TLocalizePlaceArrayItem
			| TLocalizeObjectArrayItem
	) {
		const replace =
			'localized_name' in suggestion
				? suggestion.localized_name
				: 'localized_concept' in suggestion
					? suggestion.localized_concept
					: 'localized_object' in suggestion
						? suggestion.localized_object
						: suggestion.localized_place
		setOptions({ search: suggestion.name })
		setOptions({ replace })
		setOptions({ replaceEnabled: true })
		const updatedChildren = structuredClone(children)
		editor.tf.setValue(breakDownValue(updatedChildren))
	}

	const characters = useMemo(
		() =>
			Object.keys(data?.characters || {}).reduce((acc, key) => {
				const obj = data?.characters?.[key]
				if (obj) {
					acc.push({ ...obj, name: key })
				}
				return acc
			}, [] as Array<TLocalizeCharacterArrayItem>),
		[data]
	)

	const places = useMemo(
		() =>
			Object.keys(data?.places || {}).reduce((acc, key) => {
				const obj = data?.places?.[key]
				if (obj) {
					acc.push({ ...obj, name: key })
				}
				return acc
			}, [] as Array<TLocalizePlaceArrayItem>),
		[data]
	)

	const concepts = useMemo(
		() =>
			Object.keys(data?.concepts || {}).reduce((acc, key) => {
				const obj = data?.concepts?.[key]
				if (obj) {
					acc.push({ ...obj, name: key })
				}
				return acc
			}, [] as Array<TLocalizeConceptArrayItem>),
		[data]
	)

	const objects = useMemo(
		() =>
			Object.keys(data?.objects || {}).reduce((acc, key) => {
				const obj = data?.objects?.[key]
				if (obj) {
					acc.push({ ...obj, name: key })
				}
				return acc
			}, [] as Array<TLocalizeObjectArrayItem>),
		[data]
	)

	async function handleDownload() {
		const url = await mutateAsync()
		if (!url?.csv_sheet_url) return
		downloadFile(url.csv_sheet_url, `LOC_sheet.csv`)
	}

	async function handleScanEpisode() {
		if (!isWriter) return
		await updateLOCMutateAsync('')
		void refetch()
	}

	const localized_entities: TLocalizationObject = [
		{
			title: 'Characters',
			entities: characters,
		},
		{
			title: 'Places',
			entities: places,
		},
		{
			title: 'Concepts',
			entities: concepts,
		},
		{
			title: 'Objects',
			entities: objects,
		},
	] as const

	return {
		handleDownload,
		localized_entities,
		handleSuggestionClick,
		toggleSearchMode,
		onReplace,
		toggleReplace,
		handlePrev,
		handleSearchChange,
		handleNext,
		onReplaceAll,
		isPending,
		occurrences,
		isFetching,
		replaceEnabled: !!replaceEnabled,
		caseSensitive: !!caseSensitive,
		search,
		ptr,
		setOptions,
		replace,
		records,
		setData,
		wholeWord: !!wholeWord,
		genitive: !!genitive,
		sheetURL,
		handleScanEpisode,
		updateLOCPending,
	}
}
