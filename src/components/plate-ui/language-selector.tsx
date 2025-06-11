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
	classes?: {
		content?: {
			root?: string
			scrollButton?: {
				icon?: string
				root?: string
			}
		}
		item?: {
			icon?: string
			root?: string
		}
		root?: string
		trigger?: {
			icon?: string
			root?: string
		}
	}
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
	classes = {},
}: TLanguageSelectorProps) => {
	return (
		<Select value={value} onValueChange={onValueChange}>
			<SelectTrigger
				className={cn('gap-2', className)}
				decoration="outline"
				classes={classes.trigger}
			>
				<SelectValue placeholder="Language" />
			</SelectTrigger>
			<SelectContent className="z-50" align="end" classes={classes.content}>
				<ForEach data={selectableLanguages}>
					{(lang) => (
						<SelectItem
							key={lang}
							disabled={disabledLanguages.includes(lang)}
							value={lang}
							classes={classes.item}
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
