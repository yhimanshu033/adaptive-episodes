import React from 'react'
import { useParams } from 'next/navigation'
import { beatSheetEditorAllowedProjects } from '@/constants/editor-constants'
import useEpisodeContent from '@/hooks/query/use-episode-content'
import usePlateStore from '@/store/plate-store'
import { BookOpen } from 'lucide-react'
import { useEditorReadOnly } from 'platejs/react'

import { ESidebar } from '@/types/plate-types'

import { ToolbarButton } from '../plate-ui/toolbar'
import { ToolbarGroup } from './toolbar'

const ToogleBeatSheetEditor = () => {
	const { id } = useParams()
	const { store, setSidebar } = usePlateStore()
	const readOnly = useEditorReadOnly()
	const currentSidebar = store((state) => state.sidebar)
	const isActive = currentSidebar === ESidebar.BEAT_SHEET
	const { data: content } = useEpisodeContent()

	const isNWMEpisode =
		content?.chapter?.props?.llm_memories &&
		'nwm_running' in content.chapter.props.llm_memories &&
		!content.chapter.props.llm_memories.nwm_running

	console.log(
		'isNWMEpisode check:',
		content?.chapter?.props?.llm_memories,
		'nwm_running' in (content?.chapter?.props?.llm_memories || {}),
		!content?.chapter?.props?.llm_memories?.nwm_running
	)

	console.log('isNWMEpisode', isNWMEpisode)

	if (
		!(beatSheetEditorAllowedProjects.includes(Number(id)) || isNWMEpisode) ||
		readOnly
	) {
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

export default ToogleBeatSheetEditor
