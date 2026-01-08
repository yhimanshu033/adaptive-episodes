'use client'

import React from 'react'
import { Headphones, Home, LogOut } from 'lucide-react'

import { Typography } from '@/components/aural-ui/typography'
import { cn } from '@/lib/aural-ui/utils'

interface StorySidebarProps {
	onLogout: () => void
}

const navItems = [
	{ key: 'home', label: 'HOME', icon: Home, active: true },
] as const

export default function StorySidebar({ onLogout }: StorySidebarProps) {
	return (
		<aside className="bg-fm-surface-primary border-fm-divider-secondary fixed top-0 left-0 z-40 flex h-screen w-[72px] flex-col items-center border-r py-6">
			{/* Logo */}
			<div className="mb-8 flex flex-col items-center gap-1">
				<div className="flex size-10 items-center justify-center rounded-lg bg-gradient-to-br from-pink-500 to-rose-600">
					<Headphones className="size-5 text-white" />
				</div>
			</div>

			{/* Navigation */}
			<nav className="flex flex-1 flex-col items-center justify-center gap-2">
				{navItems.map((item) => (
					<button
						key={item.key}
						className={cn(
							'group flex flex-col items-center gap-1 rounded-lg px-3 py-2 transition-colors',
							item.active
								? 'text-fm-primary'
								: 'text-fm-tertiary hover:text-fm-secondary'
						)}
					>
						<item.icon
							className={cn(
								'size-6 transition-colors',
								item.active
									? 'text-pink-500'
									: 'text-fm-tertiary group-hover:text-fm-secondary'
							)}
						/>
						<Typography
							variant="caption-small"
							className={cn(
								'text-[10px] tracking-wider uppercase',
								item.active ? 'text-pink-500' : ''
							)}
						>
							{item.label}
						</Typography>
					</button>
				))}
			</nav>

			{/* Logout at bottom */}
			<div className="mt-auto">
				<button
					onClick={onLogout}
					className="text-fm-tertiary hover:text-fm-primary group flex flex-col items-center gap-1 rounded-lg px-3 py-2 transition-colors"
				>
					<LogOut className="text-fm-tertiary group-hover:text-fm-primary size-6 transition-colors" />
					<Typography
						variant="caption-small"
						className="text-[10px] tracking-wider uppercase"
					>
						Logout
					</Typography>
				</button>
			</div>
		</aside>
	)
}
