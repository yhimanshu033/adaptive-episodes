import { defaultToolStates } from '@/constants/editor-constants'
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

import {
	EditorStoreType,
	SidebarContent,
	ToolStateTypes,
} from '@/types/editor-types'

const initialState: EditorStoreType = {
	toolsState: defaultToolStates,
	isTranslationOpen: false,
	showTooltip: false,
	tooltipPosition: { top: 0, left: 0 },
	isSidebarOpen: false,
	activeSidebar: 'ai',
}

const useEditorStore = create(devtools(immer(() => initialState)))

export const handleToolStates = () => {
	useEditorStore.setState((state) => {
		const newToolStates = { ...state.toolsState }
		Object.keys(newToolStates).forEach((key) => {
			newToolStates[key as keyof ToolStateTypes] =
				document.queryCommandState(key)
		})
		return { toolsState: newToolStates }
	})
}

export const toggleTranslation = () => {
	if (!useEditorStore.getState().isTranslationOpen) {
		toggleSidebarOPen(false)
	}
	useEditorStore.setState((state) => {
		return { isTranslationOpen: !state.isTranslationOpen }
	})
}

export const toggleTooltip = (showTooltip: boolean) => {
	useEditorStore.setState({ showTooltip })
}

export const setTooltipPosition = (tooltipPosition: {
	left: number
	top: number
}) => {
	useEditorStore.setState({ tooltipPosition })
}

export const toggleSidebarOPen = (toggle: boolean) => {
	if (toggle) {
		useEditorStore.setState({ isTranslationOpen: false })
	}
	useEditorStore.setState({ isSidebarOpen: toggle })
}

export const updateActiveSidebar = (sidebar: SidebarContent) => {
	const currentSidebar = useEditorStore.getState().activeSidebar
	if (currentSidebar !== sidebar) {
		useEditorStore.setState({ activeSidebar: sidebar })
		toggleSidebarOPen(true)
	} else toggleSidebarOPen(!useEditorStore.getState().isSidebarOpen)
}

export default useEditorStore
