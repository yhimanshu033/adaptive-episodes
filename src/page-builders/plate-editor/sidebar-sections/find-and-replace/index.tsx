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

	// return (
	// 	<>
	// 		<FindAndReplaceUI {...farUiprops} />
	// 		<hr />
	// 		<ReScan
	// 			handleScanEpisode={() => void value.handleScanEpisode()}
	// 			isFetching={value.isFetching}
	// 			isWriter={isWriter}
	// 			sheetURL={value.sheetURL}
	// 			updateLOCPending={value.updateLOCPending}
	// 		/>
	// 		<If condition={isWriter}>
	// 			<AddForm setData={value.setData} />
	// 		</If>
	// 	</>
	// )

	return (
		<div className="bg-fm-surface-primary">
			<FarHeader />
			<FindAndReplaceUI {...farUiprops} />
		</div>
	)
}
