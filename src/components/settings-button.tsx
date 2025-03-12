'use client'

import React from 'react'
import Link from 'next/link'
import useUnsavedChecker from '@/hooks/use-unsaved-checker'
import { Settings } from 'lucide-react'
import { useSession } from 'next-auth/react'

import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils/helpers'

export default function SettingsButton({
	className,
	label,
}: {
	className?: string
	label?: boolean
}) {
	const { data } = useSession()
	useUnsavedChecker()

	if (!data) {
		return <Link href="/auth/signin">Login</Link>
	}

	return (
		<Link
			href="/projects/settings"
			className={cn(
				'gap-2',
				buttonVariants({ size: label ? 'sm' : 'icon', variant: 'ghost' }),
				className
			)}
		>
			<Settings />
			{label && <span>Settings</span>}
		</Link>
	)
}
