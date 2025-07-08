import React from 'react'
import { EditorExtendedStateProvider } from '@/hooks/use-editor-extend-state'
import { GlobalFindAndReplaceProvider } from '@/hooks/use-global-find-and-replace'

import { PlateEditor } from '@/components/editor/plate-editor'

export default async function Page({
	params,
}: {
	params: Promise<{ episodeId: string }>
}) {
	const { episodeId } = await params

	return (
		<EditorExtendedStateProvider episodeId={Number(episodeId)}>
			<GlobalFindAndReplaceProvider>
				<PlateEditor />
			</GlobalFindAndReplaceProvider>
		</EditorExtendedStateProvider>
	)
}
