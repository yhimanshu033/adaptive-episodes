import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { SCREEN_NAME } from '@/constants/analytics'

import { trackPage } from '@/lib/utils/analytics'

export default function usePageChange() {
	const pathname = usePathname()

	function getScreenNameFromPath(path: string): SCREEN_NAME | undefined {
		if (path.startsWith('/auth')) {
			return SCREEN_NAME.AUTH
		}
		if (
			path.startsWith('/projects') &&
			path.match(/^\/projects\/[^/]+\/[^/]+\/(content)/)
		) {
			return SCREEN_NAME.EPISODE_EDITOR
		}
		if (
			path.startsWith('/projects') &&
			path.match(/^\/projects\/[^/]+\/[^/]+\/(preview)/)
		) {
			return SCREEN_NAME.EPISODE_PREVIEW
		}
		if (path.startsWith('/projects') && path.match(/^\/projects\/[^/]+$/)) {
			return SCREEN_NAME.EPISODE_LIST
		}
		if (path.startsWith('/projects') && path.includes('/settings')) {
			return SCREEN_NAME.PROJECT_SETTINGS
		}
		if (path.startsWith('/projects')) {
			return SCREEN_NAME.PROJECTS
		}
		if (path.startsWith('/')) {
			return SCREEN_NAME.LANDING
		}
	}

	useEffect(() => {
		const screenName = getScreenNameFromPath(pathname)
		if (!screenName) {
			return
		}

		trackPage({ screenName })
	}, [pathname])
}
