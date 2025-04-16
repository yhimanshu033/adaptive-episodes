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
	onChange: (language: ELanguage) => void
	selectableLanguages?: ELanguage[]
	value: ELanguage
}
const LanguageSelector = ({
	onChange,
	value,
	selectableLanguages = languages,
	className,
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
					<SelectItem key={index} value={lang}>
						{languageToTitle[lang]}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	)
}

export default LanguageSelector
