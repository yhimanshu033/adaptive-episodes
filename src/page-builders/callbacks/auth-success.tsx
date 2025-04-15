import React from 'react'
import { getTranslations } from 'next-intl/server'

export default async function AuthSuccess() {
	const dict = await getTranslations('auth')
	return (
		<div className="flex min-h-svh flex-col items-center justify-center gap-6">
			<h2 className="text-4xl font-semibold">{dict('success')}</h2>
			<h4>{dict('uploadEpisode')}</h4>
		</div>
	)
}
