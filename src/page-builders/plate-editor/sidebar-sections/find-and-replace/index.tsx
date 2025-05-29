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
	const value = useFindAndReplace()

	const { isWriter } = useProjectId()

	const farUiprops: IFindAndReplaceUIProps = {
		...value,
		isWriter,
	}

	return (
		<>
			<FindAndReplaceUI {...farUiprops} />
			<hr />
			<ReScan
				handleScanEpisode={() => void value.handleScanEpisode()}
				isFetching={value.isFetching}
				isWriter={isWriter}
				sheetURL={value.sheetURL}
				updateLOCPending={value.updateLOCPending}
			/>
			<If condition={isWriter}>
				<AddForm setData={value.setData} />
			</If>
		</>
	)
}
