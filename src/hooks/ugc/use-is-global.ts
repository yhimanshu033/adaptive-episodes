import { GLOBAL_USERS } from '@/page-builders/plate-editor/sidebar-sections/outliner/lib/constants'
import { useGlobalStore } from '@/store/global-store'
import { useShallow } from 'zustand/react/shallow'

export default function useIsGlobal() {
	const userData = useGlobalStore(useShallow((store) => store.userData))

	return GLOBAL_USERS.has(userData?.user?.email?.toLowerCase?.() || '')
}
