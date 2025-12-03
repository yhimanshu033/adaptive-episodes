import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
	PREFERABLE_LANGUAGES,
	SOURCE_TO_TARGET_LANGUAGE_MAP,
} from '@/constants/ai-constants'
import { ELLMModel } from '@/constants/episodes-constants'
import { INDEXED_DB_KEYS } from '@/constants/global-constants'
import useAdaptationMutation from '@/hooks/mutation/use-adaptation-mutation'
import AdaptationDialog from '@/page-builders/episodes/dialogs/adaptation-dialog'
import ExitAdaptationDialog from '@/page-builders/episodes/dialogs/exit-adaptation-dialog'

import {
	getSelectableLanguages,
	parseInputLSMapping,
} from '@/lib/utils/helpers'
import { getRecentStore } from '@/lib/utils/indexed-db'

import {
	ELanguage,
	LSMappingOutputItemV2,
	LSMappingSequenceData,
	TSourceLanguage,
} from '@/types/common'
import { TEpisode } from '@/types/episode-type'
import { TStory } from '@/types/story-types'

function useAdaptationUtil() {
	const [open, setOpen] = useState(false)
	const [openExitDialog, setOpenExitDialog] = useState(false)
	const [selectedRowData, setSelectedRowData] = useState<TEpisode[]>([])
	const [selectedAdaptingLanguage, setSelectedAdaptingLanguage] = useState<
		ELanguage | undefined
	>(ELanguage.GERMAN)

	const [storyData, setStory] = useState<TStory | null>()
	const [tableData, setTableData] = useState<LSMappingOutputItemV2>({})
	const [isFetchingLSSheet, setFetchingLSSheet] = useState<boolean>(false)
	const [isEpisodeAdaptation, setEpisodeAdaptation] = useState<boolean>(false)
	const [llmModel, setLLMModel] = useState<ELLMModel>(ELLMModel.HYBRID)
	const [abort, setAbort] = useState(false)
	const [sequence, setSequence] = useState<
		LSMappingSequenceData['sequence_ls']
	>({})
	const [skipNewExtraction, setSkipNewExtraction] = useState<boolean>(false)
	const [lsTaskId, setLsTaskId] = useState<string | null>(null)
	const abortControllerRef = useRef<AbortController | null>(null)

	const {
		createLSMutation: { mutate, isPending, data, reset },
		sendLSMutation: {
			mutate: sendLS,
			data: sendLSData,
			isPending: sendLSPending,
			reset: resetSendLS,
		},
		discardLsTaskMutation: {
			mutate: discardLsTask,
			isPending: discardLsTaskPending,
		},
	} = useAdaptationMutation({
		abortControllerRef,
	})

	const step = useMemo(() => {
		// return 3
		if (sendLSData) {
			return 4
		}
		if (sendLSPending) {
			return 2
		}
		if (data?.ls_mapping || Object.keys(tableData).length) {
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
		setTableData({})
	}, [reset, resetSendLS, setTableData])

	const handleDiscardAdaptationTask = () => {
		console.log('taskid after discard', lsTaskId)
		if (lsTaskId) {
			discardLsTask(
				{ lsTaskId, projectId: storyData?.id || 0 },
				{
					onSuccess: () => {
						setLsTaskId(null)
						setOpenExitDialog(false)
						setAbort(true)
						setOpen(false)
					},
				}
			)
		} else {
			setOpenExitDialog(false)
			setAbort(true)
			setOpen(false)
		}
	}

	useEffect(() => {
		setSelectedAdaptingLanguage(
			PREFERABLE_LANGUAGES[currentLanguage] || selectableLanguages[0]
		)
	}, [currentLanguage, selectableLanguages])

	useEffect(() => {
		if (!data) {
			return
		}
		const { data: tableData, sequence } = parseInputLSMapping(data)
		setTableData(tableData)
		setSequence(sequence || {})
	}, [data, setTableData, setSequence])

	useEffect(() => {
		resetMutations()
	}, [selectedRowData, resetMutations])

	useEffect(() => {
		if ((step === 4 && !open) || abort) {
			resetMutations()
			setStory(null)
			setFetchingLSSheet(false)
			setSelectedRowData([])
			setAbort(false)
			setLLMModel(ELLMModel.GEMINI)
			return
		}
	}, [step, open, resetMutations, abort])

	useEffect(() => {
		abortControllerRef.current = new AbortController()
		return () => {
			abortControllerRef.current?.abort()
		}
	}, [])

	useEffect(() => {
		if (abort) {
			if (step === 2) {
				abortControllerRef.current?.abort()
			}
			setAbort(false)
		}
	}, [abort, step])

	useEffect(() => {
		if (step !== 3) {
			return
		}
		const fetchLlmModel = async () => {
			const model =
				(await getRecentStore<ELLMModel>(INDEXED_DB_KEYS.LLM_MODEL)) ||
				ELLMModel.HYBRID
			if (model) {
				setLLMModel(model)
			}
		}
		void fetchLlmModel()
	}, [step])

	return {
		abortControllerRef,
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
		openExitDialog,
		setOpenExitDialog,
		setAbort,
		isFetchingLSSheet,
		setSequence,
		sequence,
		skipNewExtraction,
		setSkipNewExtraction,
		lsTaskId,
		setLsTaskId,
		handleDiscardAdaptationTask,
		discardLsTaskPending,
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
			<ExitAdaptationDialog />
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
