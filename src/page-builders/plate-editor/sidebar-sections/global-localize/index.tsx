import React from 'react'
import useGlobalFindAndReplace from '@/hooks/use-global-find-and-replace'
import FindAndReplaceUI from '@/page-builders/plate-editor/sidebar-sections/find-and-replace/far'

import useProjectId from '@/providers/project-id-provider'

import FarHeader from '../find-and-replace/far-header'

export default function GlobalLocalize() {
	const props = useGlobalFindAndReplace()

	const { isWriter } = useProjectId()

	return (
		<div className="bg-fm-surface-primary sticky top-0 size-fit">
			<FarHeader
				isWriter={isWriter}
				value={{
					caseSensitive: props.caseSensitive,
					wholeWord: props.wholeWord,
					toggleSearchMode: props.toggleSearchMode,
				}}
			/>
			<FindAndReplaceUI {...props} isWriter={isWriter} />
		</div>
	)
}
