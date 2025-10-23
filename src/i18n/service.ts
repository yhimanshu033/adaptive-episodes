'use server'

import { cookies, headers } from 'next/headers'
import { defaultLocale, Locale, locales } from '@/i18n/config'

import { getAcceptLanguageLocale } from '@/lib/utils/helpers'

// also read it from a database, backend service, or any other source.
const COOKIE_NAME = 'NEXT_LOCALE'

export async function getUserLocale() {
	let locale = (await cookies()).get(COOKIE_NAME)?.value

	if (!locale) {
		const headersObj = await headers()
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		locale = getAcceptLanguageLocale(headersObj, locales as any, defaultLocale)
	}

	return (locale || defaultLocale) as Locale
}

export async function setUserLocale(locale: Locale) {
	; (await cookies()).set(COOKIE_NAME, locale)
}
