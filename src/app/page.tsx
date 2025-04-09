import React from 'react'
import Home from '@/page-builders/home'
import { getTranslations } from 'next-intl/server'

export default async function Page() {
	const t = await getTranslations('HomePage')
	console.log({ d: t('title') })
	return <Home />
}
