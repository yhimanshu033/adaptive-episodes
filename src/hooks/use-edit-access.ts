import { useMemo } from 'react'
import useRecentUser from '@/hooks/use-recent-user'
import useStatuses from '@/hooks/use-statuses'

import useProjectId from '@/providers/project-id-provider'

export default function useEditAccess() {
	const { isWriter } = useProjectId()

	const { latestStatus, selectedStatus } = useStatuses()
	const { canCurrentUserBeRecent } = useRecentUser()

	const noAccess = useMemo(() => {
		return !isWriter || !canCurrentUserBeRecent
	}, [isWriter, canCurrentUserBeRecent])

	const cannotEdit = useMemo(() => {
		return noAccess || selectedStatus !== latestStatus
	}, [noAccess, selectedStatus, latestStatus])

	return { cannotEdit, noAccess }
}
