'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import { pathsWithoutGlobalHeader } from '@/constants/global-constants'

import Logo from '@/components/logo'
import SettingsButton from '@/components/settings-button'
import { ThemeToggle } from '@/components/theme-toggle'

const Header = () => {
	const path = usePathname()
	const isExcluded = pathsWithoutGlobalHeader.some((part) =>
		path.includes(part)
	)

	if (isExcluded) {
		return null
	}

	return (
		<div className="animate-fade-in-down bg-background sticky left-0 top-0 z-50 border-b">
			<header className="animate-fade-in-down container flex h-14 items-center justify-between">
				<Logo />
				<div className="flex items-center gap-2">
					<ThemeToggle />
					<SettingsButton />
				</div>
			</header>
		</div>
	)
}

export default Header
