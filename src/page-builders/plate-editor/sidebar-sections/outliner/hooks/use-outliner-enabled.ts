import { useParams } from 'next/navigation'
import {
	OUTLINER_ENABLED_PROJECTS,
	OUTLINER_ENABLED_USERS,
} from '@/page-builders/plate-editor/sidebar-sections/outliner/lib/constants'
import { useGlobalStore } from '@/store/global-store'
import { useShallow } from 'zustand/react/shallow'

export default function useOutlinerEnabled() {
	const { id } = useParams()
	const userData = useGlobalStore(useShallow((state) => state.userData))

	return (
		OUTLINER_ENABLED_PROJECTS.has(Number(id)) &&
		OUTLINER_ENABLED_USERS.has(userData?.user?.email || '')
	)
}
