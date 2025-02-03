import React from 'react'
import Link from 'next/link'

import { buttonVariants } from '@/lib/utils/helpers'

export default function NotFound() {
	return (
		<div className="flex min-h-svh flex-col items-center justify-center gap-6">
			<h2 className="text-4xl font-semibold">Nicht gefunden!</h2>
			<Link href="/" className={buttonVariants()}>
				Gehen Sie zur Startseite
			</Link>
		</div>
	)
}
