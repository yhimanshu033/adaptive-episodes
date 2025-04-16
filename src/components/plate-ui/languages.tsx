import React from 'react'
import useEpisodeIdStore from '@/store/episode-id-store'
import { useShallow } from 'zustand/react/shallow'

import LanguageSelector from '@/components/plate-ui/language-selector'

import { ELanguage } from '@/types/common'

const Languages = () => {
	const { store: useEpisodeIdStoreContext, setSelectedLanguage } =
		useEpisodeIdStore()
	const selectedLanguage = useEpisodeIdStoreContext(
		useShallow((s) => s.selectedLanguage)
	)

	function handleSelect(language: ELanguage) {
		setSelectedLanguage(language)
	}

	return (
		<LanguageSelector
			onChange={handleSelect}
			value={selectedLanguage}
			className="w-28"
		/>
	)
}

export default Languages
