import { useEffect } from 'react'
import { SCREEN_NAME } from '@/constants/analytics'

import { trackPage } from '@/lib/utils/analytics'

export default function usePageLoad({
	screenName,
}: {
	screenName: SCREEN_NAME
}) {
	useEffect(() => {
		trackPage({ screenName })
	}, [screenName])
}
