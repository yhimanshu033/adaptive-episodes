'use client'

import React from 'react'
import { useSearchParams } from 'next/navigation'
import { SIMPLIFIED_VIEWABLE_EDITOR } from '@/constants/global-constants'
import useEpisodeContent from '@/hooks/query/use-episode-content'
import useMyEditor from '@/hooks/use-my-editor'
import { SavingContextProvider } from '@/hooks/use-saving'
import DualView from '@/page-builders/plate-editor/dual-view'
import EditorOverlayLoader from '@/page-builders/plate-editor/editor-overlay-loader'
import { EditorSkeletonLoader } from '@/page-builders/plate-editor/editor-skelton-loader'
import EpisodeHeader from '@/page-builders/plate-editor/episode-header'
import Sidebar from '@/page-builders/plate-editor/sidebar'
import { Plate } from 'platejs/react'

import { ScrollArea } from '@/components/aural-ui/scroll-area'
import { Editor } from '@/components/plate-ui-v2/editor'
import { FixedToolbar } from '@/components/plate-ui-v2/fixed-toolbar'
import { FixedToolbarButtons } from '@/components/plate-ui-v2/fixed-toolbar-buttons'
import useProjectId from '@/providers/project-id-provider'
import { cn } from '@/lib/aural-ui/utils'

import { EStatus } from '@/types/common'
import { TGetEpisodeResponse } from '@/types/episode-type'

import { ResizablePanel, ResizablePanelGroup } from '../ui/resizable'

function MyEditor({
	content,
	latestStatus,
	importedLocal,
}: {
	content: TGetEpisodeResponse
	importedLocal: boolean
	latestStatus: EStatus | 'BASE'
}) {
	const editor = useMyEditor({
		content: content?.text,
		id: 'root-editor',
		discussions: content?.chapter?.props?.comments,
	})

	const searchParams = useSearchParams()
	const simplifiedEditor = searchParams.get(SIMPLIFIED_VIEWABLE_EDITOR)

	return (
		<Plate editor={editor}>
			<SavingContextProvider data={content} initialForceSave={importedLocal}>
				<div className="flex h-screen flex-col">
					<EditorOverlayLoader />
					<EpisodeHeader {...{ content, latestStatus }} />

					<div
						className={cn('animate-fade-in-up relative min-h-0 flex-1 pb-4')}
					>
						<ResizablePanelGroup
							direction="horizontal"
							className="flex h-full overflow-visible!"
						>
							<ResizablePanel
								minSize={50}
								order={1}
								className="h-full w-full flex-1 overflow-visible!"
							>
								<ResizablePanelGroup
									direction="horizontal"
									className="flex h-full overflow-visible!"
								>
									<ResizablePanel
										minSize={30}
										order={1}
										className="flex w-full flex-col overflow-visible!"
									>
										<FixedToolbar className="overflow-visible! px-0 py-0">
											<FixedToolbarButtons />
										</FixedToolbar>
										<ScrollArea className="max-h-[calc(100vh-168px)] overflow-y-auto">
											<Editor
												placeholder="Type..."
												autoFocus
												variant="aural"
												readOnly={!!simplifiedEditor}
											/>
										</ScrollArea>
									</ResizablePanel>
									<DualView translatedContent={content.translation_text} />
								</ResizablePanelGroup>
							</ResizablePanel>
							<Sidebar />
						</ResizablePanelGroup>
					</div>
				</div>
			</SavingContextProvider>
		</Plate>
	)
}

export default function PlateEditor() {
	const {
		data: content,
		latestStatus = 'BASE',
		importedLocal,
	} = useEpisodeContent()

	const {
		users,
		me: { user: userData },
	} = useProjectId()

	if (!content || !users || !userData) {
		return <EditorSkeletonLoader />
	}

	return <MyEditor {...{ content, latestStatus, importedLocal }} />
}
