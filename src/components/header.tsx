'use client'

import React from 'react'
import { usePathname } from 'next/navigation'

import Logo from '@/components/logo'
import SettingsButton from '@/components/settings-button'
import { ThemeToggle } from '@/components/theme-toggle'

const Header = () => {
	const path = usePathname()
	const isEditor = path.includes('/editor')

	if (isEditor) return null

	return (
		<div className="sticky left-0 top-0 z-50 animate-fade-in-down border-b bg-background">
			<header className="container flex h-14 animate-fade-in-down items-center justify-between">
				<Logo className="text-2xl font-bold" />
				<div className="flex items-center gap-2">
					<ThemeToggle />
					<SettingsButton />
				</div>
			</header>
		</div>
	)
}

export default Header
