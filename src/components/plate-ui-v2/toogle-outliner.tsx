import React from 'react'
import useOutlinerEnabled from '@/page-builders/plate-editor/sidebar-sections/outliner/hooks/use-outliner-enabled'
import usePlateStore from '@/store/plate-store'
import { BookOpen } from 'lucide-react'

import { ESidebar } from '@/types/plate-types'

import { ToolbarButton } from '../plate-ui/toolbar'
import { ToolbarGroup } from './toolbar'

const ToggleOutliner = () => {
	const { store, setSidebar } = usePlateStore()
	const currentSidebar = store((state) => state.sidebar)
	const isActive = currentSidebar === ESidebar.OUTLINER

	const enabled = useOutlinerEnabled()

	if (!enabled) {
		return null
	}

	return (
		<ToolbarGroup>
			<ToolbarButton
				variant={isActive ? 'active' : 'default'}
				tooltip={'Outliner'}
				onClick={() => setSidebar(ESidebar.OUTLINER, true)}
			>
				<BookOpen className="size-4" />
			</ToolbarButton>
		</ToolbarGroup>
	)
}

export default ToggleOutliner
