import React from 'react'
import useSaving from '@/hooks/use-saving'
import { signOut } from 'next-auth/react'

export default function EditorLogOutButton() {
	const { handleSave } = useSaving()

	const handleLogout = async () => {
		await handleSave()
		signOut().catch(() => {})
	}

	return (
		<div className="cursor-pointer" onClick={() => void handleLogout()}>
			Logout
		</div>
	)
}
