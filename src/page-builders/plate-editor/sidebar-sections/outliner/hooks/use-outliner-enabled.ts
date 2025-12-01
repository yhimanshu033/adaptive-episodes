import useUserAccess from '@/hooks/query/use-user-access'

import useEpisodeTableContext from '@/providers/episode-table-provider'

export default function useOutlinerEnabled() {
	const { initialStoryData } = useEpisodeTableContext()

	const { data: accessData } = useUserAccess({
		project_id: initialStoryData?.id,
	})

	return accessData?.outliner || initialStoryData?.props?.from_scratch
}
