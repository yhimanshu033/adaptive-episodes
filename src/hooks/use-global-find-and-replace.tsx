'use client'

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useParams } from 'next/navigation'
import { INITIAL_FAR_OPTIONS } from '@/constants/ai-constants'
import { ACTION, EVENT_TYPE, SCREEN_NAME } from '@/constants/analytics'
import {
	farSearchModes,
	SAVE_EPISODE_BUTTON_ID,
} from '@/constants/editor-constants'
import useLocalizeHook, {
	useUpdateLOCSheetMutation,
} from '@/hooks/mutation/use-localize-hook'
import useLOCSheetData from '@/hooks/query/use-loc-sheet-data'
import useEditorExtendedStore from '@/store/extended-store'
import { Value } from 'platejs'
import { useDebounceValue } from 'usehooks-ts'
import { useShallow } from 'zustand/react/shallow'

import { FindReplaceConfig } from '@/lib/plate/plugins/find-replace'
import {
	getLocalizationData,
	getOccurrencesUtil,
	getRecordsTextUtil,
	getRecordsUtil,
	getSuggestionValue,
	replaceAll,
	replaceOnce,
} from '@/lib/utils/ai-chatbot'
import { track } from '@/lib/utils/analytics'
import { getText } from '@/lib/utils/plate'

import { TLocalizeArrayItem, TLocalizeResponse } from '@/types/ai-types'

function useGlobalFindAndReplaceUtil() {
	const [options, setOptionsState] =
		useState<FindReplaceConfig['options']>(INITIAL_FAR_OPTIONS)

	const [debouncedOptions, setDebouncedOptions] = useDebounceValue(
		options,
		1000
	)

	const { caseSensitive, genitive, replaceEnabled, wholeWord, currentId } =
		options
	const search = options.search || ''
	const replace = options.replace || ''

	const { episodeId } = useParams()

	const [ptr, setPtr] = useState(0)
	const { store: useExtendedStore } = useEditorExtendedStore()
	const extendedEpisodeIds = useExtendedStore(
		useShallow((state) => state.extended)
	)
	const contentMap = useExtendedStore(
		useShallow((state) => state.episodeContentMap)
	)

	const extended = useExtendedStore(useShallow((state) => state.extended))

	const contentMapKeys = useMemo(() => {
		return extended.filter((key) => !!contentMap[key])
	}, [contentMap, extended])

	const text = useMemo(() => {
		if (extended.length > contentMapKeys.length) {
			return ''
		}
		return contentMapKeys.reduce((acc, key) => {
			const obj = contentMap[Number(key)]
			if (obj) {
				acc += '\n' + getText(obj.children)
			}
			return acc
		}, '')
	}, [contentMapKeys, extended.length, contentMap])

	const {
		data: fetchedData,
		isFetching,
		refetch,
	} = useLocalizeHook({
		text,
		episodeId: Number(episodeId),
	})

	const { isPending: updateLOCPending, mutateAsync: updateLOCMutateAsync } =
		useUpdateLOCSheetMutation()

	const { data: urlData } = useLOCSheetData()
	const sheetURL = urlData ? urlData.loc_sheet_url : ''

	const [data, setData] = useState<TLocalizeResponse['result'] | undefined>(
		fetchedData
	)
	useEffect(() => {
		setData(fetchedData)
	}, [fetchedData])

	const [replacedContentMap, setReplacedContentMap] = useState<
		typeof contentMap
	>({})

	const getOccurrences = useCallback(
		(children: Value) =>
			getOccurrencesUtil({
				children,
				caseSensitive,
				genitive,
				search,
				wholeWord,
			}),
		[wholeWord, genitive, search, caseSensitive]
	)

	const triggerSave = useCallback(() => {
		setTimeout(() => {
			extendedEpisodeIds.forEach((episodeId) => {
				const saveButtonElement = document.getElementById(
					`${SAVE_EPISODE_BUTTON_ID}-${episodeId}`
				)
				saveButtonElement?.click()
			})
		}, 200)
	}, [extendedEpisodeIds])

	const getRecords = useCallback(
		(children: Value) => {
			return getRecordsUtil({
				children,
				caseSensitive,
				genitive,
				search,
				wholeWord,
			})
		},
		[wholeWord, genitive, search, caseSensitive]
	)

	const occurrences = useMemo(
		() =>
			Object.values(contentMap).reduce(
				(acc, val) => acc + getOccurrences(val.children),
				0
			),
		[contentMap, getOccurrences]
	)

	const records = useMemo(() => {
		const records: number[][] = []
		contentMapKeys.forEach((key) => {
			const val = contentMap[Number(key)]
			const currRecords = getRecords(val.children)
			currRecords.forEach((rec) => records.push([Number(key), ...rec]))
		})

		return records
	}, [getRecords, contentMap, contentMapKeys])

	const getRecordTexts = useCallback(
		({ children, records }: { children: Value; records: number[][] }) =>
			getRecordsTextUtil({
				records,
				caseSensitive,
				children,
				genitive,
				search,
				wholeWord,
			}),
		[wholeWord, genitive, search, caseSensitive]
	)

	const getEpisodeRecords = useCallback(
		(key: number) => {
			const filteredRecords = records.filter((item) => item[0] === key)

			return filteredRecords.map((item) => item.slice(1))
		},
		[records]
	)

	const recordTexts = useMemo(() => {
		const texts: string[][] = []
		contentMapKeys.forEach((key) => {
			const val = contentMap[Number(key)]
			const currRecordTexts = getRecordTexts({
				children: val.children,
				records: getEpisodeRecords(Number(key)),
			})
			texts.push(...currRecordTexts)
		})
		return texts
	}, [getRecordTexts, contentMap, contentMapKeys, getEpisodeRecords])

	const setOptions = useCallback(
		(value: Partial<typeof options>) =>
			setOptionsState((prev) => ({ ...prev, ...value })),
		[setOptionsState]
	)

	useEffect(() => {
		setDebouncedOptions(options)
	}, [setDebouncedOptions, options])

	useEffect(() => {
		if (!records[ptr]) {
			if (records.length && records[ptr % records.length]) {
				setPtr(ptr % records.length)
			}
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
		if (!search || !replaceEnabled) {
			return
		}
		const replacedContent = contentMapKeys.reduce(
			(acc, key) => {
				const children = contentMap[Number(key)].children
				const updatedChildren = replaceAll({
					caseSensitive,
					children,
					genitive,
					replace,
					replaceEnabled,
					search,
					wholeWord,
				})
				return { ...acc, [Number(key)]: { children: updatedChildren } }
			},
			{} as typeof contentMap
		)

		setReplacedContentMap(replacedContent)
		triggerSave()
		track({
			event: EVENT_TYPE.BUTTON_CLICK,
			screenName: SCREEN_NAME.EPISODE_EDITOR,
			metaData: {
				action: ACTION.FIND_REPLACE_ALL,
			},
		})
	}, [
		search,
		triggerSave,
		replaceEnabled,
		wholeWord,
		genitive,
		caseSensitive,
		replace,
		contentMap,
		contentMapKeys,
	])

	const onReplace = useCallback(() => {
		const [episodeId, ...path] = currentId || records[ptr]

		const children = contentMap[episodeId]?.children || []
		const updatedChildren = replaceOnce({ children, path, search, replace })

		setReplacedContentMap((prev) => ({
			...prev,
			[episodeId]: { children: updatedChildren },
		}))

		triggerSave()
	}, [
		currentId,
		ptr,
		records,
		replace,
		search,
		contentMap,
		setReplacedContentMap,
		triggerSave,
	])

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
	}

	function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
		setOptions({ search: e.target.value })
	}

	function onReplaceChange(e: React.ChangeEvent<HTMLInputElement>) {
		setOptions({ replace: e.target.value })
	}

	function handleSuggestionClick(suggestion: TLocalizeArrayItem) {
		const replace = getSuggestionValue(suggestion)
		setOptions({ search: suggestion.name, replace, replaceEnabled })
		track({
			event: EVENT_TYPE.BUTTON_CLICK,
			screenName: SCREEN_NAME.EPISODE_EDITOR,
			metaData: {
				action: ACTION.FIND_REPLACE_SUGGESTION,
				suggestion: suggestion.name,
				suggestionReason: suggestion.reason,
			},
		})
	}

	async function handleScanEpisode() {
		await updateLOCMutateAsync('')
		void refetch()
	}

	const localized_entities = useMemo(
		() => getLocalizationData({ data }),
		[data]
	)

	return {
		localized_entities,
		handleSuggestionClick,
		toggleSearchMode,
		onReplace,
		toggleReplace,
		handlePrev,
		handleSearchChange,
		handleNext,
		onReplaceAll,
		occurrences,
		isFetching,
		replaceEnabled: !!replaceEnabled,
		caseSensitive: !!caseSensitive,
		search,
		ptr,
		setOptions,
		replace,
		records,
		wholeWord: !!wholeWord,
		genitive: !!genitive,
		onReplaceChange,
		options: {
			...debouncedOptions,
			currentId: options.currentId,
		} as FindReplaceConfig['options'],
		replacedContentMap,
		setReplacedContentMap,
		recordTexts,
		setPtr,
		updateLOCPending,
		handleScanEpisode,
		sheetURL,
		setData,
	}
}

export type UseGlobalFARRet = ReturnType<typeof useGlobalFindAndReplaceUtil>
const GlobalFindAndReplaceContext = React.createContext<UseGlobalFARRet | null>(
	null
)

export function GlobalFindAndReplaceProvider({
	children,
}: {
	children: React.ReactNode
}) {
	const value = useGlobalFindAndReplaceUtil()
	return (
		<GlobalFindAndReplaceContext.Provider value={value}>
			{children}
		</GlobalFindAndReplaceContext.Provider>
	)
}

export default function useGlobalFindAndReplace() {
	const value = React.useContext(GlobalFindAndReplaceContext)
	if (!value) {
		return {
			caseSensitive: false,
			genitive: false,
			handleNext: () => {},
			handlePrev: () => {},
			handleSearchChange: () => {},
			handleSuggestionClick: () => {},
			isFetching: false,
			localized_entities: getLocalizationData({ data: undefined }),
			occurrences: 0,
			onReplace: () => {},
			onReplaceAll: () => {},
			onReplaceChange: () => {},
			options: {},
			ptr: 0,
			records: [],
			recordTexts: [],
			replace: '',
			replacedContentMap: {},
			replaceEnabled: true,
			search: '',
			setOptions: () => {},
			setPtr: () => {},
			setReplacedContentMap: () => {},
			toggleReplace: () => {},
			toggleSearchMode: () => {},
			wholeWord: false,
			handleScanEpisode: async () => {},
			sheetURL: '',
			updateLOCPending: false,
			setData: () => {},
		} as ReturnType<typeof useGlobalFindAndReplaceUtil>
	}
	return value
}
