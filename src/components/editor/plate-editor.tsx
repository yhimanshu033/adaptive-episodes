'use client'

import React from 'react'
// import { useSearchParams } from 'next/navigation'
// import { GLOBAL_LOCALIZE } from '@/constants/global-constants'
// import EpisodeNavigation from '@/page-builders/plate-editor/episode-navigation'
// import GlobalLocalize from '@/page-builders/plate-editor/sidebar-sections/global-localize'
import useEditorExtendedStore from '@/store/extended-store'
import { Plate, usePlateEditor } from 'platejs/react'
import { useShallow } from 'zustand/react/shallow'

import { BasicNodesKit } from '@/components/editor/plugins/basic-nodes-kit'
import { Editor, EditorContainer } from '@/components/plate-ui-v2/editor'
import { EpisodeIdProvider } from '@/providers/episode-id-provider'

import { SuggestionToolbarButton } from '../plate-ui-v2/suggestion-toolbar-button'
import { Toolbar } from '../plate-ui-v2/toolbar'
import { CommentKit } from './plugins/comment-kit'
import { DiscussionKit } from './plugins/discussion-kit'
import { SuggestionKit } from './plugins/suggestion-kit'

export function PlateEditor() {
	const editor = usePlateEditor({
		plugins: [
			...BasicNodesKit,
			...SuggestionKit,
			...CommentKit,
			...DiscussionKit,
		],
		value,
		id: 'editor',
	})
	const { store: extendStore } = useEditorExtendedStore()
	const extended = extendStore(useShallow((state) => state.extended))
	// const searchParams = useSearchParams()
	// const globalLocalize = searchParams.get(GLOBAL_LOCALIZE)

	return (
		<main className="flex flex-1 flex-col">
			<div className="max-auto container flex px-6">
				{/* <If condition={!globalLocalize}>
					<EpisodeIdProvider key={extended[0]} episodeId={extended[0]}>
						<EpisodeNavigation />
					</EpisodeIdProvider>
				</If> */}
				<div className="relative w-full">
					{extended.map((episodeId) => (
						<EpisodeIdProvider key={episodeId} episodeId={episodeId}>
							<Plate editor={editor}>
								<Toolbar>
									<SuggestionToolbarButton />
								</Toolbar>
								<EditorContainer>
									<Editor variant="demo" placeholder="Type..." />
								</EditorContainer>
							</Plate>
						</EpisodeIdProvider>
					))}
				</div>
				{/* <If condition={!!globalLocalize}>
					<GlobalLocalize />
				</If> */}
			</div>
		</main>
	)
}

const value = [
	{
		children: [{ text: 'Basic Editor' }],
		type: 'h1',
	},
	{
		children: [{ text: 'Heading 2' }],
		type: 'h2',
	},
	{
		children: [{ text: 'Heading 3' }],
		type: 'h3',
	},
	{
		children: [{ text: 'This is a blockquote element' }],
		type: 'blockquote',
	},
	{
		children: [
			{ text: 'Basic marks: ' },
			{ bold: true, text: 'bold' },
			{ text: ', ' },
			{ italic: true, text: 'italic' },
			{ text: ', ' },
			{ text: 'underline', underline: true },
			{ text: ', ' },
			{ strikethrough: true, text: 'strikethrough' },
			{ text: '.' },
		],
		type: 'p',
	},
]
