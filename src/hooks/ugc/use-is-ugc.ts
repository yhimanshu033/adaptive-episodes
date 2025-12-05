import useIsExternalUser from '@/hooks/ugc/use-is-external-user'

import useEpisodeTableContext from '@/providers/episode-table-provider'

export default function useIsUGC() {
	const isExternal = useIsExternalUser()
	const { initialStoryData } = useEpisodeTableContext()

	return isExternal || !!initialStoryData?.props?.from_scratch
}
