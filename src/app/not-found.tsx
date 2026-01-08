'use client'

import React from 'react'
import Link from 'next/link'

import { buttonVariants } from '@/components/aural-ui/button'

export default function NotFound() {
	return (
		<div className="flex min-h-svh flex-col items-center justify-center gap-6">
			<h2 className="text-4xl font-semibold">{'Page Not Found'}</h2>
			<Link href="/" className={buttonVariants()}>
				{'Go to Home Page'}
			</Link>
		</div>
	)
}
