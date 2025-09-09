import React from 'react'
import { useParams } from 'next/navigation'
import { beatSheetEditorAllowedProjects } from '@/constants/editor-constants'
import usePlateStore from '@/store/plate-store'
import { BookOpen } from 'lucide-react'

import { ESidebar } from '@/types/plate-types'

import { ToolbarButton } from '../plate-ui/toolbar'

const ToogleBeatSheetEditor = () => {
	const { id } = useParams()
	const { store, setSidebar } = usePlateStore()
	const currentSidebar = store((state) => state.sidebar)
	const isActive = currentSidebar === ESidebar.BEAT_SHEET

	if (!beatSheetEditorAllowedProjects.includes(Number(id))) {
		return null
	}

	return (
		<ToolbarButton
			variant={isActive ? 'active' : 'default'}
			tooltip={'Beat Sheet Editor'}
			onClick={() => setSidebar(ESidebar.BEAT_SHEET, true)}
		>
			<BookOpen className="size-4" />
		</ToolbarButton>
	)
}

export default ToogleBeatSheetEditor
