import React from 'react'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'

import { buttonVariants } from '@/lib/utils/helpers'

export default async function NotFound() {
	const dict = await getTranslations('notFound')
	return (
		<div className="flex min-h-svh flex-col items-center justify-center gap-6">
			<h2 className="text-4xl font-semibold">{dict('title')}</h2>
			<Link href="/" className={buttonVariants()}>
				{dict('description')}
			</Link>
		</div>
	)
}
