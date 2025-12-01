import { useParams } from 'next/navigation'
import {
	GLOBAL_USERS,
	OUTLINER_ENABLED_PROJECTS,
	OUTLINER_ENABLED_USERS,
} from '@/page-builders/plate-editor/sidebar-sections/outliner/lib/constants'
import { useGlobalStore } from '@/store/global-store'
import { useShallow } from 'zustand/react/shallow'

import useEpisodeTableContext from '@/providers/episode-table-provider'

export default function useOutlinerEnabled() {
	const { id } = useParams()
	const { initialStoryData } = useEpisodeTableContext()
	const userData = useGlobalStore(useShallow((state) => state.userData))

	return (
		(OUTLINER_ENABLED_PROJECTS.has(Number(id)) ||
			initialStoryData?.props?.from_scratch) &&
		(OUTLINER_ENABLED_USERS.has(userData?.user?.email?.toLowerCase() || '') ||
			GLOBAL_USERS.has(userData?.user?.email?.toLowerCase() || ''))
	)
}
