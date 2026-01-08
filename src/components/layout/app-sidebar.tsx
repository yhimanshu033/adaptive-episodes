'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useDemoAuthStore } from '@/store/demo-auth-store'
import { Headphones, Home, LogOut } from 'lucide-react'
import { toast } from 'sonner'

import { Typography } from '@/components/aural-ui/typography'
import { cn } from '@/lib/aural-ui/utils'
import { SIGNIN_ROUTE } from '@/lib/demo-auth'

const navItems = [
	{ key: 'home', label: 'HOME', icon: Home, href: '/' },
] as const

export default function AppSidebar() {
	const router = useRouter()
	const pathname = usePathname()
	const { signOut } = useDemoAuthStore()

	const handleLogout = () => {
		signOut()
		toast.success('Signed out.')
		router.replace(SIGNIN_ROUTE)
	}

	return (
		<aside className="bg-fm-surface-primary border-fm-divider-secondary fixed top-0 left-0 z-40 flex h-screen w-[72px] flex-col items-center border-r py-6">
			{/* Logo */}
			<div className="mb-8 flex flex-col items-center gap-1">
				<Link
					href="/"
					className="flex size-10 items-center justify-center rounded-lg bg-linear-to-br from-pink-500 to-rose-600"
				>
					<Headphones className="size-5 text-white" />
				</Link>
			</div>

			{/* Navigation */}
			<nav className="flex flex-1 flex-col items-center justify-center gap-2">
				{navItems.map((item) => {
					const isActive = pathname === item.href

					return (
						<Link
							key={item.key}
							href={item.href}
							className={cn(
								'group flex flex-col items-center gap-1 rounded-lg px-3 py-2 transition-colors',
								isActive
									? 'text-fm-primary'
									: 'text-fm-tertiary hover:text-fm-secondary'
							)}
						>
							<item.icon
								className={cn(
									'size-6 transition-colors',
									isActive
										? 'text-pink-500'
										: 'text-fm-tertiary group-hover:text-fm-secondary'
								)}
							/>
							<Typography
								variant="caption-small"
								className={cn(
									'text-[10px] tracking-wider uppercase',
									isActive ? 'text-pink-500' : ''
								)}
							>
								{item.label}
							</Typography>
						</Link>
					)
				})}
			</nav>

			{/* Logout at bottom */}
			<div className="mt-auto">
				<button
					onClick={handleLogout}
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
