import { useParams } from 'next/navigation'
import { beatSheetEditorAllowedProjects } from '@/constants/editor-constants'
import useEpisodeContent from '@/hooks/query/use-episode-content'
import { useEditorReadOnly } from 'platejs/react'

export default function useBeatSheetEnabled() {
	const { id } = useParams()
	const readOnly = useEditorReadOnly()
	const { data: content } = useEpisodeContent()

	const isNWMEpisode = content?.chapter?.props?.nwm_running === false

	if (
		!(beatSheetEditorAllowedProjects.includes(Number(id)) || isNWMEpisode) ||
		readOnly
	) {
		return false
	}

	return true
}
