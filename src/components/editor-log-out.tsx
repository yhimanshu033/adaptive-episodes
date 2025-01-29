import React from 'react'
import useSaving from '@/hooks/use-saving'
import useEpisodeIdStore from '@/store/episode-id-store'
import { signOut } from 'next-auth/react'

export default function EditorLogOutButton() {
	const { handleSave, isSaved } = useSaving()
	const { setStartOverlayLoading } = useEpisodeIdStore()

	const handleLogout = async () => {
		if (!isSaved) {
			setStartOverlayLoading(true)
			await handleSave()
		}
		signOut().catch(() => {})
	}

	return (
		<div className="cursor-pointer" onClick={() => void handleLogout()}>
			Logout
		</div>
	)
}
