'use client'

import React, { useEffect } from 'react'
import Link from 'next/link'
import * as Sentry from '@sentry/nextjs'

import { buttonVariants } from '@/lib/utils/helpers'

export default function GlobalError({
	error,
}: {
	error: Error & { digest?: string }
}) {
	useEffect(() => {
		Sentry.captureException(error)
	}, [error])

	return (
		<html>
			<body>
				<div className="flex min-h-svh flex-col items-center justify-center gap-6">
					<h2 className="text-4xl font-semibold">
						Es ist ein Fehler aufgetreten!
					</h2>
					<Link href="/" className={buttonVariants()}>
						Gehen Sie zur Startseite
					</Link>
				</div>
			</body>
		</html>
	)
}
