import React from 'react'
import useBeatSheetEnabled from '@/hooks/use-beatsheet-enabled'
import usePlateStore from '@/store/plate-store'
import { BookOpen } from 'lucide-react'

import { ESidebar } from '@/types/plate-types'

import { ToolbarButton } from '../plate-ui/toolbar'
import { ToolbarGroup } from './toolbar'

const ToggleBeatSheetEditor = () => {
	const { store, setSidebar } = usePlateStore()
	const currentSidebar = store((state) => state.sidebar)
	const isActive = currentSidebar === ESidebar.BEAT_SHEET

	const isBSEEnabled = useBeatSheetEnabled()

	if (!isBSEEnabled) {
		return null
	}

	return (
		<ToolbarGroup>
			<ToolbarButton
				variant={isActive ? 'active' : 'default'}
				tooltip={'Beat Sheet Editor'}
				onClick={() => setSidebar(ESidebar.BEAT_SHEET, true)}
			>
				<BookOpen className="size-4" />
			</ToolbarButton>
		</ToolbarGroup>
	)
}

export default ToggleBeatSheetEditor
