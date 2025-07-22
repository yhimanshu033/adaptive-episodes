import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { COPILOT_LOGO_URL } from '@/constants/global-constants'

const Logo = () => {
	return (
		<Link
			href="/"
			className="flex items-center gap-2 transition-all hover:scale-105"
		>
			<Image
				src={COPILOT_LOGO_URL}
				width={32}
				height={32}
				alt="Copilot Logo"
				loading="lazy"
			/>
		</Link>
	)
}

export default Logo
