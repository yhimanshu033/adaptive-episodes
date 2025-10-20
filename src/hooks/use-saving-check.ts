import { useCallback, useEffect, useRef } from 'react'
import { NWM_EMAIL } from '@/constants/global-constants'
import useEpisodeContentMutation from '@/hooks/mutation/use-episode-content-mutation'
import useEpisodeContent from '@/hooks/query/use-episode-content'
import useRecentUser from '@/hooks/use-recent-user'
import useSaving from '@/hooks/use-saving'
import useEpisodeIdStore from '@/store/episode-id-store'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'

export default function useSavingCheck() {
	const { data } = useEpisodeContent()
	const { mutateAsync } = useEpisodeContentMutation(data?.chapter.id || 0)
	const { isSaved, handleSave } = useSaving()

	const { canCurrentUserBeRecent } = useRecentUser()
	const { data: session } = useSession()
	const { setRecentEmail } = useEpisodeIdStore()

	const intervalRef = useRef<NodeJS.Timeout | null>(null)

	const handleSavingCheck = useCallback(async () => {
		const content = await mutateAsync()

		const isNWMRunning = content?.chapter?.props?.nwm_running
		if (isNWMRunning) {
			setRecentEmail(NWM_EMAIL)
			toast.info(`NWM is regenerating the chapter`)
			return
		}

		const isBlockedByUser =
			!!content?.email && content.email !== session?.user?.email
		if (isBlockedByUser) {
			setRecentEmail(content.email)
			toast.info(
				`${content.email} is now editing the chapter ${content.chapter.seq_number}`
			)
		}
	}, [mutateAsync, session, setRecentEmail])

	// FOR CHECKING IF USER IS OWNER EVERY 9.9 MINS
	useEffect(() => {
		if (!canCurrentUserBeRecent || !isSaved) {
			return
		}
		const intervalDuration = 9.9 * 60 * 1000 // 9.9 minutes --> 10 mins lock

		// Set interval every 9.9 minutes
		const interval = setInterval(() => {
			void handleSavingCheck()
		}, intervalDuration)

		intervalRef.current = interval

		// Cleanup on unmount or when isSaved becomes false
		return () => {
			if (intervalRef.current) {
				clearInterval(intervalRef.current)
				intervalRef.current = null
			}
		}
	}, [isSaved, canCurrentUserBeRecent, handleSavingCheck])

	// FOR TRIGGERING SAVING BEFORE REFRESH
	useEffect(() => {
		const handleBeforeUnload = (e: BeforeUnloadEvent) => {
			if (!isSaved) {
				void handleSave()
				e.preventDefault()
				e.returnValue = ''
			}
		}
		window.addEventListener('beforeunload', handleBeforeUnload)
		return () => {
			window.removeEventListener('beforeunload', handleBeforeUnload)
		}
	}, [isSaved, handleSave])

	// FOR TRIGGERING SAVING EVERY 2S
	useEffect(() => {
		const intervalId = setInterval(() => void handleSave(), 2000)
		return () => clearInterval(intervalId)
	}, [handleSave])
}
