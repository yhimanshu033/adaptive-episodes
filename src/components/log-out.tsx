import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'

import EditorLogOutButton from '@/components/editor-log-out'

export default function LogOutButton() {
	const session = useSession()
	const { data } = session

	const pathname = usePathname()

	const isEditorPage = pathname.includes('/editor')

	const handleLogout = () => {
		signOut().catch(() => {})
	}

	if (!data) {
		return <Link href="/auth/signin">Login</Link>
	}

	return isEditorPage ? (
		<EditorLogOutButton />
	) : (
		<div className="cursor-pointer" onClick={handleLogout}>
			Logout
		</div>
	)
}
