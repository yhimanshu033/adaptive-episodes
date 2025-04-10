import { DICTS } from '@/constants/localization-constants'
import { getUserLocale } from '@/i18n/service'
import { getRequestConfig } from 'next-intl/server'

export default getRequestConfig(async () => {
	const locale = await getUserLocale()

	return {
		locale,
		messages: DICTS[locale],
	}
})
