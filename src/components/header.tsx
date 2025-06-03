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
		<div className="animate-fade-in-down bg-background border-fm-divider-tertiary sticky top-0 left-0 z-40 border-b">
			<header className="animate-fade-in-down container flex h-14 items-center justify-between">
				<Logo />
				<div className="flex items-center gap-2">
					<UserProfile />
				</div>
			</header>
		</div>
	)
}

export default Header
