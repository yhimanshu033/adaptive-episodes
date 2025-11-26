import { useGlobalStore } from '@/store/global-store'
import { useShallow } from 'zustand/react/shallow'

import useEpisodeTableContext from '@/providers/episode-table-provider'
import { isInternalUser } from '@/lib/utils/helpers'

export default function useIsUGC() {
	const userData = useGlobalStore(useShallow((store) => store.userData))
	const { initialStoryData } = useEpisodeTableContext()

	return !isInternalUser(userData) || !!initialStoryData?.props?.from_scratch
}
