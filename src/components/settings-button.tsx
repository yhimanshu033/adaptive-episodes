'use client'

import React from 'react'
import Link from 'next/link'
import { Settings } from 'lucide-react'
import { useSession } from 'next-auth/react'

import { buttonVariants } from '@/components/ui/button'

export default function SettingsButton() {
	const { data } = useSession()

	if (!data) {
		return <Link href="/auth/signin">Login</Link>
	}

	return (
		<Link
			href="/projects/settings"
			className={buttonVariants({ size: 'icon', variant: 'ghost' })}
		>
			<Settings />
		</Link>
	)
}
