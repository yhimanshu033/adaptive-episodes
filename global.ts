import { TLocaleDict } from '@/constants/localization'

declare module 'next-intl' {
	interface AppConfig {
		Messages: TLocaleDict
	}
}
