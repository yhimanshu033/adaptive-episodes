import React from 'react'

import LogOutButton from '@/components/log-out'
import Logo from '@/components/logo'
import { ThemeToggle } from '@/components/theme-toggle'

const Header = () => {
	return (
		<div className="animate-fade-in-down border-b">
			<header className="container flex h-14 animate-fade-in-down items-center justify-between">
				<Logo className="text-2xl font-bold" />
				<div className="flex items-center gap-2">
					<ThemeToggle />
					<LogOutButton />
				</div>
			</header>
		</div>
	)
}

export default Header
