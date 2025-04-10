import { TLocaleDict } from '@/constants/localization-constants'

declare module 'next-intl' {
  interface AppConfig {
    Messages: TLocaleDict
  }
}
