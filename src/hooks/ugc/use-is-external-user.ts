import { useGlobalStore } from '@/store/global-store'
import { useShallow } from 'zustand/react/shallow'

import { isInternalUser } from '@/lib/utils/helpers'

export default function useIsExternalUser() {
	const userData = useGlobalStore(useShallow((store) => store.userData))

	return !isInternalUser(userData)
}
