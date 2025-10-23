import React from 'react'
import useEpisodeContent from '@/hooks/query/use-episode-content'
import useAccessChecks from '@/hooks/use-access-checks'
import useLanguage from '@/hooks/use-language'
import { useEpisodeIdStore } from 'unified-editor'

import LanguageSelector from '@/components/plate-ui/language-selector'

const Languages = () => {
	const { languages: languagesAvailable, disabledLanguages } =
		useEpisodeContent()
	const { setSelectedLanguage } = useEpisodeIdStore()
	const selectedLanguage = useLanguage()

	const { isGerman } = useAccessChecks()

	if (isGerman) {
		return null
	}

	return (
		<LanguageSelector
			onValueChange={setSelectedLanguage}
			selectableLanguages={languagesAvailable}
			value={selectedLanguage}
			disabledLanguages={disabledLanguages}
			className="w-28"
			classes={{
				trigger: {
					root: 'border-fm-divider-secondary font-fm-brand h-auto rounded-full [&_>span]:text-left',
					icon: 'size-4',
				},
				content: {
					scrollButton: {
						icon: 'size-4',
					},
				},
				item: {
					root: '[font-size:var(--text-fm-sm)]',
					icon: 'size-4',
				},
			}}
		/>
	)
}

export default Languages
