import React from 'react'
import useFindAndReplace from '@/hooks/use-find-and-replace'
import AddForm from '@/page-builders/plate-editor/sidebar-sections/find-and-replace/add-form'
import FindAndReplaceUI, {
	IFindAndReplaceUIProps,
} from '@/page-builders/plate-editor/sidebar-sections/find-and-replace/far'
import ReScan from '@/page-builders/plate-editor/sidebar-sections/find-and-replace/re-scan'

import { If } from '@/components/if-else'
import useProjectId from '@/providers/project-id-provider'

export default function FindAndReplace() {
	const {
		localized_entities,
		handleNext,
		handlePrev,
		handleSearchChange,
		handleSuggestionClick,
		isFetching,
		occurrences,
		onReplace,
		onReplaceAll,
		toggleSearchMode,
		toggleReplace,
		replaceEnabled,
		caseSensitive,
		ptr,
		records,
		replace,
		search,
		setData,
		setOptions,
		wholeWord,
		genitive,
		sheetURL,
		handleScanEpisode,
		updateLOCPending,
	} = useFindAndReplace()

	const { isWriter } = useProjectId()

	const farUiprops: IFindAndReplaceUIProps = {
		toggleReplace,
		caseSensitive,
		handleNext,
		handlePrev,
		handleSearchChange,
		isFetching,
		isWriter,
		localized_entities,
		occurrences,
		onReplace,
		onReplaceAll,
		ptr,
		replaceEnabled,
		search,
		toggleSearchMode,
		wholeWord,
		records,
		onReplaceChange: (e) => setOptions({ replace: e.target.value }),
		replace,
		genitive,
		handleSuggestionClick,
	}

	return (
		<>
			<FindAndReplaceUI {...farUiprops} />
			<hr />
			<ReScan
				handleScanEpisode={() => void handleScanEpisode()}
				isFetching={isFetching}
				isWriter={isWriter}
				sheetURL={sheetURL}
				updateLOCPending={updateLOCPending}
			/>
			<If condition={isWriter}>
				<AddForm setData={setData} />
			</If>
		</>
	)
}
