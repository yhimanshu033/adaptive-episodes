import React from 'react'
import { useConfigurationUtil } from '@/hooks/use-configuration'

type TConfigurationContextValue = ReturnType<typeof useConfigurationUtil>

const ConfigurationContext =
	React.createContext<TConfigurationContextValue | null>(null)

export function ConfigurationContextProvider({
	children,
}: React.PropsWithChildren) {
	const value = useConfigurationUtil()
	return (
		<ConfigurationContext.Provider value={value}>
			{children}
		</ConfigurationContext.Provider>
	)
}

export default function useConfiguration() {
	const context = React.useContext(ConfigurationContext)

	if (!context) {
		throw new Error(
			'useConfiguration must be used inside ConfigurationContextProvider'
		)
	}

	return context
}
