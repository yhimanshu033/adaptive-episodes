import { useMemo } from 'react'
import useEpisodeIdStore from '@/store/episode-id-store'
import { useSession } from 'next-auth/react'
import { useShallow } from 'zustand/react/shallow'

export default function useRecentUser() {
	const { store: episodeIdStore } = useEpisodeIdStore()
	const recentEmail = episodeIdStore(useShallow((state) => state.recentEmail))

	const { data: session } = useSession()

	const canCurrentUserBeRecent = useMemo(() => {
		if (!recentEmail) {
			return true
		}
		if (!session?.user.email || session?.user.email !== recentEmail) {
			return false
		}
		return true
	}, [recentEmail, session])

	return { canCurrentUserBeRecent }
}
