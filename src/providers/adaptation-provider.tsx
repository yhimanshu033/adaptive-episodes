import React, { useCallback, useEffect, useMemo, useState } from 'react'
import {
	PREFERABLE_LANGUAGES,
	SOURCE_TO_TARGET_LANGUAGE_MAP,
} from '@/constants/ai-constants'
import { ELLMModel } from '@/constants/episodes-constants'
import useAdaptationMutation from '@/hooks/mutation/use-adaptation-mutation'
import AdaptationDialog from '@/page-builders/episodes/adaptation-dialog'

import {
	getSelectableLanguages,
	parseInputLSMapping,
} from '@/lib/utils/helpers'

import { ELanguage, LSMappingOutput, TSourceLanguage } from '@/types/common'
import { TEpisode } from '@/types/episode-type'
import { TStory } from '@/types/story-types'

function useAdaptationUtil() {
	const [open, setOpen] = useState(false)
	const [selectedRowData, setSelectedRowData] = useState<TEpisode[]>([])
	const [selectedAdaptingLanguage, setSelectedAdaptingLanguage] =
		useState<ELanguage>(ELanguage.GERMAN)

	const [storyData, setStory] = useState<TStory | null>()
	const [tableData, setTableData] = useState<LSMappingOutput['ls_mapping']>([])
	const [isFetchingLSSheet, setFetchingLSSheet] = useState<boolean>(false)
	const [isEpisodeAdaptation, setEpisodeAdaptation] = useState<boolean>(false)
	const [llmModel, setLLMModel] = useState<ELLMModel>(ELLMModel.GEMINI)

	const {
		createLSMutation: { mutate, isPending, data, reset },
		sendLSMutation: {
			mutate: sendLS,
			data: sendLSData,
			isPending: sendLSPending,
			reset: resetSendLS,
		},
	} = useAdaptationMutation(() => setOpen(true))

	const step = useMemo(() => {
		if (sendLSData) {
			return 4
		}
		if (sendLSPending) {
			return 2
		}
		if (data?.ls_mapping || tableData.length) {
			return 3
		}
		if (isPending || isFetchingLSSheet) {
			return 2
		}
		if (
			storyData?.adapting_seq_nos &&
			selectedRowData.some((row) =>
				storyData.adapting_seq_nos?.includes(row.seq_number)
			)
		) {
			return -1
		}
		return 1
	}, [
		sendLSData,
		sendLSPending,
		data?.ls_mapping,
		tableData,
		isPending,
		isFetchingLSSheet,
		storyData?.adapting_seq_nos,
		selectedRowData,
	])

	const currentLanguage = useMemo(
		() =>
			(isEpisodeAdaptation
				? (storyData?.parent_language as TSourceLanguage)
				: (storyData?.source_language as TSourceLanguage)) || ELanguage.ENGLISH,
		[
			isEpisodeAdaptation,
			storyData?.parent_language,
			storyData?.source_language,
		]
	)

	const selectableLanguages = useMemo(
		() =>
			SOURCE_TO_TARGET_LANGUAGE_MAP[currentLanguage] ||
			getSelectableLanguages(currentLanguage),
		[currentLanguage]
	)

	const resetMutations = useCallback(() => {
		reset()
		resetSendLS()
		setTableData([])
	}, [reset, resetSendLS, setTableData])

	useEffect(() => {
		setSelectedAdaptingLanguage(
			PREFERABLE_LANGUAGES[currentLanguage] || selectableLanguages[0]
		)
	}, [currentLanguage, selectableLanguages])

	useEffect(() => {
		if (!data) {
			return
		}
		setTableData(parseInputLSMapping(data))
	}, [data, setTableData])

	useEffect(() => {
		resetMutations()
	}, [selectedRowData, resetMutations])

	useEffect(() => {
		if (step === 4 && !open) {
			resetMutations()
			setFetchingLSSheet(false)
			setSelectedRowData([])
			return
		}
	}, [open, resetMutations, step])

	return {
		selectedRowData,
		setSelectedRowData,
		selectedAdaptingLanguage,
		setSelectedAdaptingLanguage,
		currentLanguage,
		selectableLanguages,
		open,
		setOpen,
		mutate,
		reset,
		sendLS,
		step,
		data,
		tableData,
		setTableData,
		setStory,
		setFetchingLSSheet,
		storyData,
		isEpisodeAdaptation,
		setEpisodeAdaptation,
		llmModel,
		setLLMModel,
	}
}

const AdaptationContext = React.createContext<ReturnType<
	typeof useAdaptationUtil
> | null>(null)

export const AdaptationProvider = ({
	children,
}: {
	children: React.ReactNode
}) => {
	const value = useAdaptationUtil()

	return (
		<AdaptationContext.Provider value={value}>
			{children}
			<AdaptationDialog />
		</AdaptationContext.Provider>
	)
}

export default function useAdaptation() {
	const context = React.useContext(AdaptationContext)
	if (!context) {
		throw new Error('useAdaptation must be used within an AdaptationProvider')
	}
	return context
}
