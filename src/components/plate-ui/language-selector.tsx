import React from 'react'
import {
	ELLMModel,
	languages,
	languageToTitle,
	LLM_MODELS,
	modelToTitle,
} from '@/constants/episodes-constants'

import {
	Select,
	SelectContent,
	SelectItem,
	SelectSeparator,
	SelectTrigger,
	SelectValue,
} from '@/components/aural-ui/select'
import IfElse from '@/components/if-else'
import ForEach from '@/components/ui/for-each'
import { cn } from '@/lib/utils/helpers'

import { ELanguage } from '@/types/common'

import { If } from '../aural-ui/if-else'

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
	placeholder?: string
	selectableLanguages?: ELanguage[]
	value: ELanguage | undefined
}

interface TModelSelectorProps {
	className?: string
	onValueChange: (model: ELLMModel) => void
	value: string
}

const LanguageSelector = ({
	onValueChange,
	value,
	selectableLanguages = languages,
	className,
	disabledLanguages = [],
	classes = {},
	placeholder = 'Language',
}: TLanguageSelectorProps) => {
	return (
		<Select value={value} onValueChange={onValueChange}>
			<SelectTrigger
				id="adapt_language"
				className={cn('gap-2', className)}
				decoration="outline"
				classes={classes.trigger}
			>
				<SelectValue placeholder={placeholder} />
			</SelectTrigger>
			<SelectContent className="z-50" align="end" classes={classes.content}>
				<ForEach data={selectableLanguages}>
					{(lang, index) => (
						<div key={lang}>
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
							<If condition={selectableLanguages.length - 1 !== index}>
								<SelectSeparator />
							</If>
						</div>
					)}
				</ForEach>
			</SelectContent>
		</Select>
	)
}

export const LLMModelSelector = ({
	onValueChange,
	value,
	className,
}: TModelSelectorProps) => {
	return (
		<Select value={value} onValueChange={onValueChange}>
			<SelectTrigger
				id="select_model"
				className={cn('gap-2', className)}
				decoration="outline"
			>
				<SelectValue placeholder="Model" />
			</SelectTrigger>
			<SelectContent className="z-50" align="end">
				<ForEach data={LLM_MODELS}>
					{(model) => (
						<SelectItem key={model} value={model}>
							{modelToTitle[model]}
						</SelectItem>
					)}
				</ForEach>
			</SelectContent>
		</Select>
	)
}

export default LanguageSelector
