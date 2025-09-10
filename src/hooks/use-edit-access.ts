import { useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import { SIMPLIFIED_VIEWABLE_EDITOR } from '@/constants/global-constants'
import useRecentUser from '@/hooks/use-recent-user'
import useStatuses from '@/hooks/use-statuses'

import useProjectId from '@/providers/project-id-provider'

export default function useEditAccess() {
	const { isWriter } = useProjectId()
	const searchParams = useSearchParams()
	const simplifiedEditor = searchParams.get(SIMPLIFIED_VIEWABLE_EDITOR)

	const { latestStatus, selectedStatus } = useStatuses()
	const { canCurrentUserBeRecent } = useRecentUser()

	const noAccess = useMemo(() => {
		return !isWriter || !!simplifiedEditor || !canCurrentUserBeRecent
	}, [isWriter, canCurrentUserBeRecent, simplifiedEditor])

	const cannotEdit = useMemo(() => {
		return noAccess || selectedStatus !== latestStatus
	}, [noAccess, selectedStatus, latestStatus])

	return { cannotEdit, noAccess }
}
