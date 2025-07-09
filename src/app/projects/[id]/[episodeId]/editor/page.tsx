import React from 'react'

// import { EditorExtendedStateProvider } from '@/hooks/use-editor-extend-state'
// import { GlobalFindAndReplaceProvider } from '@/hooks/use-global-find-and-replace'
// import EpisodePlateEditor from '@/page-builders/plate-editor'

export default async function Page({
	params,
}: {
	params: Promise<{ episodeId: string }>
}) {
	// const { episodeId } = await params

	return (
		<p>coming soon...</p>
		// <EditorExtendedStateProvider episodeId={Number(episodeId)}>
		// 	<GlobalFindAndReplaceProvider>
		// 		<EpisodePlateEditor />
		// 	</GlobalFindAndReplaceProvider>
		// </EditorExtendedStateProvider>
	)
}
