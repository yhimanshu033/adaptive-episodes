import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { farSearchModes } from '@/constants/editor-constants'
import useLocalizeHook, {
	useLocalizeDownloadMutation,
	useUpdateLOCSheetMutation,
} from '@/hooks/mutation/use-localize-hook'
import useLanguage from '@/hooks/use-language'
import {
	useEditorPlugin,
	useEditorRef,
	useEditorState,
} from '@udecode/plate-common/react'

import useEpisodeId from '@/providers/episode-id-provider'
import useProjectId from '@/providers/project-id-provider'
import { FindReplacePlugin } from '@/lib/plate/plugins/find-replace'
import {
	getLocalizationData,
	getOccurrencesUtil,
	getRecordsUtil,
	getSuggestionValue,
	replaceAll,
	replaceOnce,
} from '@/lib/utils/ai-chatbot'
import { downloadFile } from '@/lib/utils/client-helpers'
import { breakDownValue, getText } from '@/lib/utils/plate'

import { TLocalizeArrayItem, TLocalizeResponse } from '@/types/ai-types'

import useLOCSheetData from './query/use-loc-sheet-data'

export default function useFindAndReplace() {
	const { setOptions, useOption } = useEditorPlugin(FindReplacePlugin)
	const language = useLanguage()

	const search = useOption('search') || ''
	const replace = useOption('replace') || ''
	const replaceEnabled = useOption('replaceEnabled')
	const caseSensitive = useOption('caseSensitive')
	const wholeWord = useOption('wholeWord')
	const genitive = useOption('genitive')
	const [ptr, setPtr] = useState(0)

	const { children } = useEditorState()
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

	useEffect(() => {
		setData(fetchedData)
	}, [fetchedData])

	const editor = useEditorRef()

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

	useEffect(() => {
		if (!records[ptr]) {
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
	const onReplaceAll = useCallback(() => {
		if (!search || !replaceEnabled || !editor) {
			return
		}
		const updatedChildren = replaceAll({
			caseSensitive,
			children,
			genitive,
			replace,
			replaceEnabled,
			search,
			wholeWord,
		})
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
		const updatedChildren = replaceOnce({ children, path, search, replace })
		editor.tf.setValue(breakDownValue(updatedChildren))
	}, [children, editor.tf, ptr, records, replace, search])

	function handlePrev() {
		setPtr(ptr > 0 ? ptr - 1 : ptr)
	}

	function handleNext() {
		setPtr(ptr < records.length - 1 ? ptr + 1 : ptr)
	}

	function toggleSearchMode(mode: farSearchModes) {
		if (mode === farSearchModes.CASE_SENSITIVE) {
			setOptions({ caseSensitive: !caseSensitive })
		} else if (mode === farSearchModes.WHOLE_WORD) {
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

	function handleSuggestionClick(suggestion: TLocalizeArrayItem) {
		const replace = getSuggestionValue(suggestion)
		setOptions({ search: suggestion.name })
		setOptions({ replace })
		setOptions({ replaceEnabled: true })
		const updatedChildren = structuredClone(children)
		editor.tf.setValue(breakDownValue(updatedChildren))
	}

	async function handleDownload() {
		const url = await mutateAsync()
		if (!url?.csv_sheet_url) {
			return
		}
		downloadFile(url.csv_sheet_url, `LOC_sheet.csv`)
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
