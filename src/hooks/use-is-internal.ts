import { useMemo } from 'react'
import { useSession } from 'next-auth/react'

import { isInternalUser } from '@/lib/utils/helpers'

export default function useIsInternal() {
	const { data: session } = useSession()
	const isInternal = useMemo(() => isInternalUser(session), [session])

	return isInternal
}
