import React from 'react'
import { languages, languageToTitle } from '@/constants/episodes-constants'

import IfElse from '@/components/if-else'
import ForEach from '@/components/ui/for-each'
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
	onValueChange: (language: ELanguage) => void
	selectableLanguages?: ELanguage[]
	value: ELanguage
}
const LanguageSelector = ({
	onValueChange,
	value,
	selectableLanguages = languages,
	className,
	disabledLanguages = [],
}: TLanguageSelectorProps) => {
	return (
		<Select value={value} onValueChange={onValueChange}>
			<SelectTrigger className={cn('gap-2', className)}>
				<SelectValue placeholder="Language" />
			</SelectTrigger>
			<SelectContent>
				<ForEach data={selectableLanguages}>
					{(lang) => (
						<SelectItem
							disabled={disabledLanguages.includes(lang)}
							value={lang}
						>
							<IfElse
								condition={disabledLanguages.includes(lang)}
								if={`${languageToTitle[lang]} (adapting)`}
								else={languageToTitle[lang]}
							/>
						</SelectItem>
					)}
				</ForEach>
			</SelectContent>
		</Select>
	)
}

export default LanguageSelector
