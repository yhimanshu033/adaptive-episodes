import { useCallback, useEffect, useMemo } from 'react'
import { DEFAULT_CONFIGURATION_DATA } from '@/constants/editor-constants'
import useConfigurationStore, {
	setConfigurationData,
} from '@/store/configuration-store'

import {
	getLocallyStoredConfiguration,
	setLocallyStoredConfiguration,
} from '@/lib/utils/client-helpers'

import { TConfigurationData } from '@/types/editor-types'

export function useConfigurationUtil() {
	const storedData = useMemo(() => {
		return getLocallyStoredConfiguration() || DEFAULT_CONFIGURATION_DATA
	}, [])
	const configurationData = useConfigurationStore()

	const setStoredConfiguration = useCallback(
		(newData: Partial<TConfigurationData>) => {
			setLocallyStoredConfiguration(newData)
		},
		[]
	)

	const handleConfigurationDataChange = useCallback(
		(newData: Partial<TConfigurationData>, temp = false) => {
			setConfigurationData(newData)
			if (!temp) {
				setStoredConfiguration(newData)
			}
		},
		[setStoredConfiguration]
	)

	useEffect(() => {
		if (!storedData) {
			return
		}
		setConfigurationData(storedData)
	}, [storedData])

	return {
		handleConfigurationDataChange,
		configurationData,
	}
}
