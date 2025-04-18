import React from 'react'
import useGlobalFindAndReplace from '@/hooks/use-global-find-and-replace'
import FindAndReplaceUI from '@/page-builders/plate-editor/sidebar-sections/find-and-replace/far'

import useProjectId from '@/providers/project-id-provider'

export default function GlobalLocalize() {
	const props = useGlobalFindAndReplace()

	const { isWriter } = useProjectId()

	return (
		<div className="sticky top-0 size-fit">
			<FindAndReplaceUI {...props} isWriter={isWriter} />
		</div>
	)
}
