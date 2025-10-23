import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { INITIAL_FAR_OPTIONS } from '@/constants/ai-constants'
import { farSearchModes } from '@/constants/editor-constants'
import useLocalizeHook, {
	useLocalizeDownloadMutation,
	useUpdateLOCSheetMutation,
} from '@/hooks/mutation/use-localize-hook'
import { useEditorData } from 'unified-editor'
import useSuggestionGuard from '@/hooks/plate/use-suggestion-guard'
import { useDebounce } from '@/hooks/use-debounce'
import useLanguage from '@/hooks/use-language'
import { isEqual } from 'lodash'
import {
	useEditorPlugin,
	useEditorReadOnly,
	useEditorRef,
	usePluginOptions,
} from 'platejs/react'

import useEpisodeId from '@/providers/episode-id-provider'
import useProjectId from '@/providers/project-id-provider'
import { FindReplacePlugin } from '@/lib/plate/plugins/find-replace'
import {
	getFindReplaceRegex,
	getLocalizationData,
	getOccurrencesUtil,
	getRecordsTextUtil,
	getRecordsUtil,
	getSuggestionValue,
} from '@/lib/utils/ai-chatbot'
import { downloadFile } from '@/lib/utils/client-helpers'
import { replaceNthOccurrence } from '@/lib/utils/helpers'
import { getText } from '@/lib/utils/plate'

import { TLocalizeArrayItem, TLocalizeResponse } from '@/types/ai-types'

import useLOCSheetData from './query/use-loc-sheet-data'

export default function useFindAndReplace() {
	const { setOptions } = useEditorPlugin(FindReplacePlugin)
	const { suggestionGuard } = useSuggestionGuard()

	const language = useLanguage()

	const {
		search,
		replace,
		replaceEnabled,
		caseSensitive,
		wholeWord,
		genitive,
		currentId,
	} = usePluginOptions(FindReplacePlugin, (state) => ({
		search: state.search || '',
		replace: state.replace || '',
		replaceEnabled: state.replaceEnabled || true,
		caseSensitive: state.caseSensitive || false,
		wholeWord: state.wholeWord || false,
		genitive: state.genitive || false,
		currentId: state.currentId || [],
	}))

	const [realTimeData, setRealTimeData] = useState({ search })
	const debouncedData = useDebounce(realTimeData, 250)

	const readOnly = useEditorReadOnly()

	const [ptr, setPtr] = useState(0)

	const { children } = useEditorData()
	const text = useMemo(() => getText(children), [children])
	const episodeId = useEpisodeId()
	const {
		data: fetchedData,
		refetch,
		isFetching,
	} = useLocalizeHook({ text, episodeId, language })
	const { isPending, mutateAsync } = useLocalizeDownloadMutation()
	const { isPending: updateLOCPending, mutateAsync: updateLOCMutateAsync } =
		useUpdateLOCSheetMutation()
	const [data, setData] = useState<TLocalizeResponse['result'] | undefined>(
		fetchedData
	)
	const { data: urlData } = useLOCSheetData()
	const sheetURL = urlData ? urlData.loc_sheet_url : ''

	const { isWriter } = useProjectId()
	const editor = useEditorRef()

	useEffect(() => {
		setData(fetchedData)
	}, [fetchedData])

	useEffect(() => {
		if (debouncedData.search === search) {
			return
		}
		setOptions(debouncedData)
		editor.api.redecorate()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [debouncedData])

	const occurrences = useMemo(
		() =>
			getOccurrencesUtil({
				caseSensitive,
				children,
				genitive,
				search,
				wholeWord,
			}),
		[children, wholeWord, genitive, search, caseSensitive]
	)

	const records = useMemo(
		() =>
			getRecordsUtil({ caseSensitive, children, genitive, search, wholeWord }),
		[children, wholeWord, genitive, search, caseSensitive]
	)

	const recordTexts = useMemo(
		() =>
			getRecordsTextUtil({
				records,
				caseSensitive,
				children,
				genitive,
				search,
				wholeWord,
			}),
		[records, caseSensitive, children, genitive, search, wholeWord]
	)

	useEffect(() => {
		if (!records.length || !!records[ptr]) {
			return
		}
		if (ptr >= records.length) {
			setPtr(records.length - 1)
		}
	}, [ptr, records])

	useEffect(() => {
		if (!records?.[ptr]) {
			return
		}
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

	const onReplaceRecord = useCallback(
		(record: number[]) => {
			const [blockIdx, leafIdx, matchIdx] = record

			const node = editor.api.node([blockIdx, leafIdx])
			if (!node?.[0]) {
				return
			}
			const { occurrenceIdx, occurrence } = replaceNthOccurrence({
				input: String(node[0].text),
				n: matchIdx,
				regex: getFindReplaceRegex({
					search,
					caseSensitive,
					genitive,
					wholeWord,
				}),
				replaceWith: replace,
			})

			editor.tf.select({
				path: [blockIdx, leafIdx],
				offset: occurrenceIdx,
			})

			editor.tf.insertText(replace)

			suggestionGuard((isSuggesting) => {
				if (isSuggesting) {
					Array.from({ length: occurrence.length }).forEach(() => {
						editor.tf.deleteForward('character')
					})
				} else {
					editor.tf.delete({
						distance: occurrence.length,
						reverse: false,
					})
				}
			}, true)
		},
		[
			editor.tf,
			editor.api,
			replace,
			search,
			suggestionGuard,
			caseSensitive,
			genitive,
			wholeWord,
		]
	)

	const onReplaceAll = useCallback(() => {
		if (!search || !replaceEnabled || !replace) {
			return
		}
		const reversedRecords = [...records].reverse()
		for (const record of reversedRecords) {
			onReplaceRecord(record)
		}
		setOptions({ search: '', replace: '' })
		setRealTimeData({ search: '' })
	}, [search, replaceEnabled, replace, setOptions, records, onReplaceRecord])

	const onReplace = useCallback(() => {
		const path = currentId

		const currentIdx = records.findIndex((item) => isEqual(item, currentId))
		if (currentIdx === -1 || records.length === 1) {
			setPtr(0)
		} else {
			setPtr(currentIdx % (records.length - 1))
		}
		onReplaceRecord(path)
	}, [currentId, records, onReplaceRecord])

	function handlePrev() {
		setPtr(ptr > 0 ? ptr - 1 : ptr)
	}

	function handleNext() {
		setPtr(ptr < records.length - 1 ? ptr + 1 : ptr)
	}

	function onReplaceChange(e: React.ChangeEvent<HTMLInputElement>) {
		setOptions({ replace: e.target.value })
	}

	function toggleSearchMode(mode: farSearchModes) {
		if (mode === farSearchModes.CASE_SENSITIVE) {
			setOptions({ caseSensitive: !caseSensitive })
		} else if (mode === farSearchModes.WHOLE_WORD) {
			setOptions({ wholeWord: !wholeWord, genitive: !wholeWord })
		}
		editor.api.redecorate()
	}

	function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
		setRealTimeData((prev) => {
			return {
				...prev,
				search: e.target.value,
			}
		})
	}

	function handleSuggestionClick(suggestion: TLocalizeArrayItem) {
		const replace = getSuggestionValue(suggestion) || ''
		setOptions({ search: suggestion.name })
		setRealTimeData({ search: suggestion.name })
		setOptions({ replace })
		setOptions({ replaceEnabled: true })
		editor.api.redecorate()
	}

	async function handleDownload() {
		const url = await mutateAsync()
	}

	async function handleScanEpisode() {
		if (!isWriter) {
			return
		}
		await updateLOCMutateAsync('')
		void refetch()
	}

	const localized_entities = useMemo(
		() => getLocalizationData({ data }),
		[data]
	)

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
		replaceEnabled: !readOnly && !!replaceEnabled,
		caseSensitive: !!caseSensitive,
		search: realTimeData.search,
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
		recordTexts,
		onReplaceChange,
		options: INITIAL_FAR_OPTIONS,
		replacedContentMap: {},
		setReplacedContentMap: () => { },
		setPtr,
	}
}

export type useFindAndReplaceRet = ReturnType<typeof useFindAndReplace>
