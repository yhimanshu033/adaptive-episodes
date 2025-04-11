import { Locale } from '@/i18n/config'

import DE_LANG from './de'
import EN_LANG from './en'

export type TLocaleDict = typeof EN_LANG

const DICTS: Record<Locale, TLocaleDict> = {
	en: EN_LANG,
	de: DE_LANG,
}

export default DICTS
