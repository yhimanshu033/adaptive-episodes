import React, { useCallback } from 'react'
import { languages, languageToTitle } from '@/constants/episodes-constants'

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils/helpers'

import { ELanguage } from '@/types/common'

interface TLanguageSelectorProps {
	className?: string
	disabledLanguages?: ELanguage[]
	onChange: (language: ELanguage) => void
	selectableLanguages?: ELanguage[]
	value: ELanguage
}
const LanguageSelector = ({
	onChange,
	value,
	selectableLanguages = languages,
	className,
	disabledLanguages = [],
}: TLanguageSelectorProps) => {
	const handleSelect = useCallback(
		(language: ELanguage) => {
			onChange(language)
		},
		[onChange]
	)

	return (
		<Select value={value} onValueChange={handleSelect}>
			<SelectTrigger className={cn('gap-2', className)}>
				<SelectValue placeholder="Language" />
			</SelectTrigger>
			<SelectContent>
				{selectableLanguages.map((lang, index) => (
					<SelectItem
						key={index}
						disabled={disabledLanguages.includes(lang)}
						value={lang}
					>
						{languageToTitle[lang] +
							(disabledLanguages.includes(lang) ? ' (adapting)' : '')}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	)
}

export default LanguageSelector
