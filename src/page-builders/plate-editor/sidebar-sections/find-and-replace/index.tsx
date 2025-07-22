import React from 'react'
import useFindAndReplace from '@/hooks/use-find-and-replace'
import FindAndReplaceUI, {
	IFindAndReplaceUIProps,
} from '@/page-builders/plate-editor/sidebar-sections/find-and-replace/far'

import useProjectId from '@/providers/project-id-provider'

import FarHeader from './far-header'

export default function FindAndReplace() {
	const value = useFindAndReplace()

	const { isWriter } = useProjectId()

	const farUiprops: IFindAndReplaceUIProps = {
		...value,
		isWriter,
	}

	return (
		<div className="bg-fm-surface-primary">
			<FarHeader
				sheetURL={value.sheetURL}
				isWriter={isWriter}
				value={{
					caseSensitive: value.caseSensitive,
					wholeWord: value.wholeWord,
					toggleSearchMode: value.toggleSearchMode,
				}}
			/>
			<FindAndReplaceUI {...farUiprops} />
		</div>
	)
}
