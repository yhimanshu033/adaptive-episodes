import React from 'react'
import Link from 'next/link'
import { navLinks } from '@/constants/landing-constants'
import { Menu } from 'lucide-react'

import { Button } from '@/components/aural-ui/button'
import { Divider } from '@/components/aural-ui/divider'
import { IconButton } from '@/components/aural-ui/icon-button'
import {
	Sheet,
	SheetContent,
	SheetTitle,
	SheetTrigger,
} from '@/components/aural-ui/sheet'

const Header = () => {
	return (
		<nav className="text-fm-primary bg-fm-surface-frosted/20 animate-fade-in-down sticky top-0 z-20 flex items-center justify-between p-4 shadow-sm backdrop-blur-xl sm:p-6">
			<div className="not-sm:flex not-sm:flex-col">
				<span className="font-display text-fm-xl sm:text-fm-4xl">COPILOT</span>
				<span className="text-fm-secondary text-fm-sm sm:text-fm-xl sm:ml-1">
					by PocketFM
				</span>
			</div>

			{/* Desktop Navigation */}
			<div className="font-display text-fm-secondary text-fm-sm hidden items-center gap-3 md:flex lg:gap-6">
				{navLinks.map((link) => (
					<a
						key={link.href}
						href={link.href}
						className="hover:text-fm-primary inline-block py-1 transition-colors"
					>
						{link.label}
					</a>
				))}
				<Button
					variant="outline"
					size="sm"
					className="transition-transform hover:scale-105"
				>
					<Link href="/projects">Try it for free</Link>
				</Button>
			</div>

			{/* Mobile Navigation */}
			<div className="md:hidden">
				<Sheet>
					<SheetTrigger asChild>
						<IconButton
							variant="ghost"
							label="Menu"
							className="size-8"
							icon={<Menu className="text-fm-primary size-6" />}
						/>
					</SheetTrigger>
					<SheetContent side="right" className="w-64">
						<SheetTitle className="sr-only">Navigation Menu</SheetTitle>
						<ul className="font-display text-fm-sm flex list-none flex-col">
							{navLinks.map((link) => (
								<li key={link.href}>
									<a
										href={link.href}
										className="hover:text-fm-primary text-fm-secondary block px-4 py-2 transition-colors"
									>
										{link.label}
									</a>
									<Divider variant="dashed" />
								</li>
							))}
							<Button variant="outline" size="sm" className="mt-2">
								<Link href="/projects">Try it for free</Link>
							</Button>
						</ul>
					</SheetContent>
				</Sheet>
			</div>
		</nav>
	)
}

export default Header
