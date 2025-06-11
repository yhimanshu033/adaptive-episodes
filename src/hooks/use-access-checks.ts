import { useMemo } from 'react'
import { useSession } from 'next-auth/react'

import useEpisodeTableContext from '@/providers/episode-table-provider'
import { isInternalUser } from '@/lib/utils/helpers'

import { ELanguage } from '@/types/common'

const useAccessChecks = () => {
	const { initialStoryData } = useEpisodeTableContext()
	const { data: session } = useSession()

	const isInternal = useMemo(() => isInternalUser(session), [session])

	const isGerman = initialStoryData?.parent_language
		? initialStoryData.parent_language === ELanguage.GERMAN_ORIGINAL
		: true

	const isOriginal = initialStoryData?.is_original || false

	return { isInternal, isGerman, isOriginal }
}

export default useAccessChecks
