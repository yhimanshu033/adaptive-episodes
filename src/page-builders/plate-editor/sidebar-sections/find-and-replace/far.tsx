import React from 'react'
import { UseGlobalFARRet } from '@/hooks/use-global-find-and-replace'

import FindAndReplaceForm from './far-form'
import FindAndReplaceLocalizedList from './far-localized-list'
import FindAndReplaceResults from './far-results'

export interface IFindAndReplaceUIProps extends UseGlobalFARRet {
	isWriter: boolean
}

export default function FindAndReplaceUI({
	handleNext,
	handlePrev,
	handleSearchChange,
	isWriter,
	localized_entities,
	occurrences,
	onReplace,
	onReplaceAll,
	ptr,
	search,
	isFetching,
	records,
	onReplaceChange,
	replace,
	handleSuggestionClick,
	recordTexts,
	setPtr,
}: IFindAndReplaceUIProps) {
	return (
		<>
			<FindAndReplaceForm
				search={search}
				replace={replace}
				handleSearchChange={handleSearchChange}
				onReplaceChange={onReplaceChange}
				isWriter={isWriter}
				onReplace={onReplace}
				onReplaceAll={onReplaceAll}
			/>
			<FindAndReplaceResults
				search={search}
				replace={replace}
				occurrences={occurrences}
				recordTexts={recordTexts}
				setPtr={setPtr}
				ptr={ptr}
				handleNext={handleNext}
				handlePrev={handlePrev}
				records={records}
			/>
			<FindAndReplaceLocalizedList
				isFetching={isFetching}
				localized_entities={localized_entities}
				handleSuggestionClick={handleSuggestionClick}
			/>
		</>
	)
}
