'use client'

import React from 'react'
import Link from 'next/link'
import { signOut, useSession } from 'next-auth/react'

import Logo from './logo'
import { ThemeToggle } from './theme-toggle'

const Header = () => {
	const session = useSession()
	const { data } = session

	const handleLogout = () => {
		signOut().catch(() => {})
	}

	return (
		<div className="animate-fade-in-down border-b">
			<header className="container flex h-14 animate-fade-in-down items-center justify-between">
				<Logo className="text-2xl font-bold" />
				<div className="flex items-center gap-2">
					<ThemeToggle />
					{data ? (
						<div className="cursor-pointer" onClick={handleLogout}>
							Logout
						</div>
					) : (
						<Link href="/auth/signin">Login</Link>
					)}
				</div>
			</header>
		</div>
	)
}

export default Header
