import React from 'react'
import useGlobalFindAndReplace from '@/hooks/use-global-find-and-replace'

import useProjectId from '@/providers/project-id-provider'
import { FarHeader, FindAndReplaceUI } from 'unified-editor'

export default function GlobalLocalize() {
	const props = useGlobalFindAndReplace()

	const { isWriter } = useProjectId()

	return (
		<div className="bg-fm-surface-primary sticky top-0 h-[calc(100dvh-16px)] w-125">
			<FarHeader
				isWriter={isWriter}
				value={{
					caseSensitive: props.caseSensitive,
					wholeWord: props.wholeWord,
					toggleSearchMode: props.toggleSearchMode,
				}}
				sheetURL={props.sheetURL}
				hideCloseButton
			/>
			<FindAndReplaceUI {...props} isWriter={isWriter} />
		</div>
	)
}
