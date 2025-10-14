import { useCallback, useEffect } from 'react'
import { DEFAULT_CONFIGURATION_DATA } from '@/constants/editor-constants'
import { CONFIGURATION_STORE_NAME } from '@/constants/global-constants'
import { CONFIGURATION_QUERY_KEY } from '@/constants/query-constants'
import useConfigurationStore, {
	setConfigurationData,
} from '@/store/configuration-store'
import { useQuery } from '@tanstack/react-query'

import { openDB } from '@/lib/utils/indexed-db'

import { TConfigurationData } from '@/types/editor-types'

function useConfigurationQuery() {
	async function getConfiguration() {
		let returnedData: typeof DEFAULT_CONFIGURATION_DATA = {
			...DEFAULT_CONFIGURATION_DATA,
		}
		try {
			const db = await openDB()
			for (const key of Object.keys(
				DEFAULT_CONFIGURATION_DATA
			) as (keyof typeof DEFAULT_CONFIGURATION_DATA)[]) {
				const storedValue = await new Promise<
					(typeof DEFAULT_CONFIGURATION_DATA)[typeof key]
				>((resolve, reject) => {
					const tx = db.transaction(CONFIGURATION_STORE_NAME, 'readonly')
					const store = tx.objectStore(CONFIGURATION_STORE_NAME)
					const request = store.get(key)

					request.onsuccess = () =>
						resolve(
							request.result as (typeof DEFAULT_CONFIGURATION_DATA)[typeof key]
						)
					request.onerror = () => reject(request.error as Error)
				})
				if (storedValue !== undefined) {
					returnedData = {
						...returnedData,
						[key]: storedValue,
					}
				}
			}
		} catch (error) {
			console.error(error)
			return returnedData
		}
		return returnedData
	}

	const query = useQuery({
		queryKey: [CONFIGURATION_QUERY_KEY],
		queryFn: getConfiguration,
		staleTime: 1000 * 5, // 5s,
		gcTime: 1000 * 5, // 5s,
	})

	return query
}

export function useConfigurationUtil() {
	const { data: storedData } = useConfigurationQuery()
	const configurationData = useConfigurationStore()

	const setStoredConfiguration = useCallback(
		async (newData: Partial<TConfigurationData>) => {
			try {
				const db = await openDB()
				const tx = db.transaction(CONFIGURATION_STORE_NAME, 'readwrite')
				const store = tx.objectStore(CONFIGURATION_STORE_NAME)
				for (const [key, value] of Object.entries(newData)) {
					store.put(value, key)
				}
			} catch (error) {
				console.error(error)
			}
		},
		[]
	)

	const handleConfigurationDataChange = useCallback(
		(newData: Partial<TConfigurationData>, temp = false) => {
			setConfigurationData(newData)
			if (!temp) {
				void setStoredConfiguration(newData)
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
