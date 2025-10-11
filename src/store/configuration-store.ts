import { DEFAULT_CONFIGURATION_DATA } from '@/constants/editor-constants'
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

import {
	EConfigurationDialogContentTab,
	TConfigurationData,
} from '@/types/editor-types'

const initialState: TConfigurationData = {
	configurationDialogOpen: false,
	configurationDialogTab: EConfigurationDialogContentTab.OPTIONS,
	...DEFAULT_CONFIGURATION_DATA,
}

const useConfigurationStore = create(devtools(immer(() => initialState)))

export const setConfigurationDialogOpen = (
	configurationDialogOpen: TConfigurationData['configurationDialogOpen']
) => {
	useConfigurationStore.setState({ configurationDialogOpen })
}

export const setConfigurationDialogTab = (
	configurationDialogTab: TConfigurationData['configurationDialogTab']
) => {
	useConfigurationStore.setState({ configurationDialogTab })
}

export const setDefaultSidebar = (
	defaultSidebar: TConfigurationData['defaultSidebar']
) => {
	useConfigurationStore.setState({ defaultSidebar })
}

export const setQuickPrompts = (
	quickPrompts: TConfigurationData['quickPrompts']
) => {
	useConfigurationStore.setState({ quickPrompts })
}

export const setSuggestionDisplay = (
	suggestionDisplay: TConfigurationData['suggestionDisplay']
) => {
	useConfigurationStore.setState({ suggestionDisplay })
}

export const setTheme = (theme: TConfigurationData['theme']) => {
	useConfigurationStore.setState({ theme })
}

export const setConfigurationData = (
	configurationData: Partial<TConfigurationData>
) => {
	useConfigurationStore.setState(configurationData)
}

export default useConfigurationStore
