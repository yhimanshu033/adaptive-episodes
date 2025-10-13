import React from 'react'
import { UseGlobalFARRet } from '@/hooks/use-global-find-and-replace'

import { If } from '@/components/if-else'

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
	caseSensitive,
	wholeWord,
	toggleSearchMode,
	setData,
	handleScanEpisode,
	updateLOCPending,
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
				caseSensitive={caseSensitive}
				wholeWord={wholeWord}
				toggleSearchMode={toggleSearchMode}
				setData={setData}
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
			<If condition={!records.length}>
				<FindAndReplaceLocalizedList
					isFetching={isFetching}
					localized_entities={localized_entities}
					handleSuggestionClick={handleSuggestionClick}
					handleScanEpisode={handleScanEpisode}
					isWriter={isWriter}
					updateLOCPending={updateLOCPending}
				/>
			</If>
		</>
	)
}
