import React from 'react'
import useEpisodeContent from '@/hooks/query/use-episode-content'
import useIsGerman from '@/hooks/use-is-german'
import useLanguage from '@/hooks/use-language'
import useEpisodeIdStore from '@/store/episode-id-store'

import LanguageSelector from '@/components/plate-ui/language-selector'

const Languages = () => {
	const { languages: languagesAvailable, disabledLanguages } =
		useEpisodeContent()
	const { setSelectedLanguage } = useEpisodeIdStore()
	const selectedLanguage = useLanguage()

	const isGerman = useIsGerman()

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
		/>
	)
}

export default Languages
