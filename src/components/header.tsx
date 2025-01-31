'use client'

import React from 'react'
import { usePathname } from 'next/navigation'

import LogOutButton from '@/components/log-out'
import Logo from '@/components/logo'
import { ThemeToggle } from '@/components/theme-toggle'
import { cn } from '@/lib/utils/helpers'

const Header = () => {
	const path = usePathname()
	const isSticky = !path.includes('editor')
	return (
		<div
			className={cn(
				'left-0 top-0 z-50 animate-fade-in-down border-b bg-background',
				{ sticky: isSticky }
			)}
		>
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
