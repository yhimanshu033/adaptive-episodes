import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { languages } from '@/constants/episodes-constants'
import useAdaptationMutation from '@/hooks/mutation/use-adaptation-mutation'
import AdaptationDialog from '@/page-builders/episodes/adaptation-dialog'

import { parseInputLSMapping } from '@/lib/utils/helpers'

import { ELanguage, LSMappingOutput } from '@/types/common'
import { TEpisode } from '@/types/episode-type'

function useAdaptationUtil() {
	const [open, setOpen] = useState(false)
	const [selectedRowData, setSelectedRowData] = useState<TEpisode[]>([])
	const [selectedAdaptingLanguage, setSelectedAdaptingLanguage] =
		useState<ELanguage>(ELanguage.MEXICAN_SPANISH)
	const currentLanguage = useMemo(
		() => selectedRowData[0]?.language || ELanguage.ENGLISH,
		[selectedRowData]
	)
	const [tableData, setTableData] = useState<LSMappingOutput['ls_mapping']>([])

	const selectableLanguages = useMemo(
		() => languages.filter((lang) => lang !== currentLanguage),
		[currentLanguage]
	)

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
		if (data?.ls_mapping) {
			return 3
		}
		if (isPending) {
			return 2
		}
		return 1
	}, [data, isPending, sendLSData, sendLSPending])

	const resetMutations = useCallback(() => {
		reset()
		resetSendLS()
		setTableData([])
	}, [reset, resetSendLS, setTableData])

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
			setSelectedRowData([])
			return
		}
	}, [step, open, resetMutations])

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
