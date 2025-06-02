import React from 'react'
import { languages, languageToTitle } from '@/constants/episodes-constants'

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/aural-ui/select'
import IfElse from '@/components/if-else'
import ForEach from '@/components/ui/for-each'
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
			<SelectTrigger className={cn('gap-2', className)} decoration="outline">
				<SelectValue placeholder="Language" />
			</SelectTrigger>
			<SelectContent className="z-50">
				<ForEach data={selectableLanguages}>
					{(lang) => (
						<SelectItem
							key={lang}
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
