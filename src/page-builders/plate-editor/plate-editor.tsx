'use client'

import React from 'react'
import { MAIN_EDITOR_ID } from '@/constants/editor-constants'
import useEpisodeContent from '@/hooks/query/use-episode-content'
import { ChatbotProvider } from '@/hooks/use-ai-chatbot'
import useMyEditor from '@/hooks/use-my-editor'
import { SavingContextProvider } from '@/hooks/use-saving'
import DualView from '@/page-builders/plate-editor/dual-view'
import EditorOverlayLoader from '@/page-builders/plate-editor/editor-overlay-loader'
import { EditorSkeletonLoader } from '@/page-builders/plate-editor/editor-skelton-loader'
import EpisodeHeader from '@/page-builders/plate-editor/episode-header'
import Sidebar from '@/page-builders/plate-editor/sidebar'
import { Plate } from 'platejs/react'

import { ScrollArea } from '@/components/aural-ui/scroll-area'
import { FixedToolbar } from '@/components/plate-ui-v2/fixed-toolbar'
import { FixedToolbarButtons } from '@/components/plate-ui-v2/fixed-toolbar-buttons'
import useProjectId from '@/providers/project-id-provider'
import { cn } from '@/lib/aural-ui/utils'

import { EStatus } from '@/types/common'
import { TGetEpisodeResponse } from '@/types/episode-type'

import FloatingLaserResponse from '../../components/plate-ui/floating-laser-response'
import FloatingPrompt from '../../components/plate-ui/floating-prompt'
import {
	ResizablePanel,
	ResizablePanelGroup,
} from '../../components/ui/resizable'
import EditorHandler from './editor-handler'

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
		content: content.text || '',
		id: MAIN_EDITOR_ID,
		comments: content?.chapter?.props?.comments,
	})

	return (
		<Plate editor={editor}>
			<SavingContextProvider data={content} initialForceSave={importedLocal}>
				<ChatbotProvider episodeContent={content}>
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
											<ScrollArea className="overflow-y-auto">
												<EditorHandler />
											</ScrollArea>
										</ResizablePanel>
										<DualView translatedContent={content.translation_text} />
									</ResizablePanelGroup>
								</ResizablePanel>
								<Sidebar />
							</ResizablePanelGroup>
						</div>
						<FloatingPrompt />
						<FloatingLaserResponse />
					</div>
				</ChatbotProvider>
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
