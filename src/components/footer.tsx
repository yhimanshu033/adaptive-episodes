import React from 'react'
import Link from 'next/link'

const Footer = () => {
	return (
		<footer className="border-t px-4 py-6 md:px-6">
			<div className="container mx-auto flex flex-col items-center justify-between md:flex-row">
				<p className="text-xs">© 2024 CoPilot . All rights reserved.</p>
				<nav className="mt-4 flex gap-4 sm:gap-6 md:mt-0">
					<Link href="#" className="text-xs underline-offset-4 hover:underline">
						Terms of Service
					</Link>
					<Link href="#" className="text-xs underline-offset-4 hover:underline">
						Privacy
					</Link>
				</nav>
			</div>
		</footer>
	)
}

export default Footer
