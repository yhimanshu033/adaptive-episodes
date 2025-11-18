import { useMemo } from 'react'
import useEpisodeContent from '@/hooks/query/use-episode-content'
import useIsUGC from '@/hooks/ugc/use-is-ugc'
import useRecentUser from '@/hooks/use-recent-user'
import useStatuses from '@/hooks/use-statuses'

import useProjectId from '@/providers/project-id-provider'
import { hasNWMRan } from '@/lib/utils/helpers'

export default function useEditAccess() {
	const { isWriter } = useProjectId()
	const { data: episodeData } = useEpisodeContent()
	const isUGC = useIsUGC()

	const { latestStatus, selectedStatus } = useStatuses()
	const { canCurrentUserBeRecent } = useRecentUser()

	const noAccess = useMemo(() => {
		if (isUGC && hasNWMRan(episodeData?.chapter)) {
			return true
		}
		return !isWriter || !canCurrentUserBeRecent
	}, [isWriter, canCurrentUserBeRecent, episodeData, isUGC])

	const cannotEdit = useMemo(() => {
		return noAccess || selectedStatus !== latestStatus
	}, [noAccess, selectedStatus, latestStatus])

	return { cannotEdit, noAccess }
}
