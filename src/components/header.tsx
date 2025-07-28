'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import { pathsWithoutGlobalHeader } from '@/constants/global-constants'
import UserProfile from '@/page-builders/user-profile'

import Logo from '@/components/logo'

const Header = () => {
	const path = usePathname()
	const isExcluded = pathsWithoutGlobalHeader.some((part) =>
		path.includes(part)
	)

	if (isExcluded) {
		return null
	}

	return (
		<div className="bg-background sticky top-0 left-0 z-40">
			<header className="animate-fade-in-down container flex min-h-18 items-center justify-between">
				<Logo />
				<div className="flex items-center gap-2">
					<UserProfile />
				</div>
			</header>

			<div className="via-fm-divider-secondary h-[1px] w-full bg-gradient-to-r from-transparent to-transparent" />
		</div>
	)
}

export default Header
