import React from 'react'
import Link from 'next/link'
import { Pen } from 'lucide-react'

const Logo = ({ className }: { className?: string }) => {
	return (
		<Link
			href="/"
			className="flex items-center gap-2 transition-all hover:scale-105"
		>
			<Pen className="size-6" />
			<span className={className}>Co-Writer</span>
		</Link>
	)
}

export default Logo
