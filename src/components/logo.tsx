import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

const Logo = ({ className }: { className?: string }) => {
	return (
		<Link
			href="/"
			className="flex items-center gap-2 transition-all hover:scale-105"
		>
			<Image
				src="/pocket-copilot-logo.png"
				width={32}
				height={32}
				alt="Copilot Logo"
			/>
			<span className={className}>Co-Writer</span>
		</Link>
	)
}

export default Logo
