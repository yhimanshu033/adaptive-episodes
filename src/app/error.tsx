'use client'

import React, { useEffect } from 'react'
import Link from 'next/link'
import * as Sentry from '@sentry/nextjs'

import { buttonVariants } from '@/components/aural-ui/button'

export default function Error({
	error,
}: {
	error: Error & { digest?: string }
}) {
	useEffect(() => {
		Sentry.captureException(error)
	}, [error])

	return (
		<div className="flex min-h-svh flex-col items-center justify-center gap-6">
			<h2 className="text-4xl font-semibold">{'Error Occurred'}</h2>
			<Link href="/" className={buttonVariants()}>
				{'Go to Home Page'}
			</Link>
		</div>
	)
}
