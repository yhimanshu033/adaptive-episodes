'use client'

import React, { useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import { MAIN_EDITOR_ID } from '@/constants/editor-constants'
import { SIMPLIFIED_VIEWABLE_EDITOR } from '@/constants/global-constants'
import useEpisodeContent from '@/hooks/query/use-episode-content'
import { ChatbotProvider } from '@/hooks/use-ai-chatbot'
import useMyEditor from '@/hooks/use-my-editor'
import { SavingContextProvider } from '@/hooks/use-saving'
import DualView from '@/page-builders/plate-editor/dual-view'
import EditorOverlayLoader from '@/page-builders/plate-editor/editor-overlay-loader'
import FocusEditorWrapper from '@/page-builders/plate-editor/focus-mode/editor-wrapper'
import Sidebar from '@/page-builders/plate-editor/sidebar'
import { cn } from '@udecode/cn'
import { Plate } from '@udecode/plate-common/react'

import { ScrollArea } from '@/components/aural-ui/scroll-area'
import { CursorOverlay } from '@/components/plate-ui/cursor-overlay'
import { Editor } from '@/components/plate-ui/editor'
import FixedToolbarComponent from '@/components/plate-ui/fixed-toolbar-component'
import FloatingLaserResponse from '@/components/plate-ui/floating-laser-response'
import FloatingPrompt from '@/components/plate-ui/floating-prompt'
import { FloatingToolbar } from '@/components/plate-ui/floating-toolbar'
import { FloatingToolbarButtons } from '@/components/plate-ui/floating-toolbar-buttons'
import { ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'

import { TCustomComment } from '@/types/editor-types'

import { EditorSkeletonLoader } from './editor-skelton-loader'
import EpisodeHeader from './episode-header'

export default function PlateEditor() {
	const containerRef = useRef<HTMLDivElement>(null)
	const { data: content, latestStatus, importedLocal } = useEpisodeContent()

	const editor = useMyEditor({
		content: content?.text || '',
		comments: content?.chapter.props?.comments,
		resolvedComments: (content?.chapter.props?.resolvedComments ||
			[]) as TCustomComment[],
		id: MAIN_EDITOR_ID,
	})

	const searchParams = useSearchParams()
	const simplifiedEditor = searchParams.get(SIMPLIFIED_VIEWABLE_EDITOR)

	if (!content || !latestStatus) {
		return <EditorSkeletonLoader />
	}

	return (
		<Plate editor={editor}>
			<SavingContextProvider data={content} initialForceSave={importedLocal}>
				<ChatbotProvider episodeContent={content}>
					<FocusEditorWrapper>
						<div className="flex h-screen flex-col">
							<EditorOverlayLoader />
							<EpisodeHeader {...{ content, latestStatus }} />
							<div
								ref={containerRef}
								className={cn(
									'animate-fade-in-up relative min-h-0 flex-1 pb-4',
									// Block selection
									'[&_.slate-start-area-left]:w-[64px]! [&_.slate-start-area-right]:w-[64px]! [&_.slate-start-area-top]:h-4!'
								)}
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
												<FixedToolbarComponent />
												<ScrollArea className="overflow-y-auto">
													<Editor
														className="size-full rounded-none"
														autoFocus
														readOnly={!!simplifiedEditor}
														focusRing={false}
														variant="ghost"
														size="md"
													/>
												</ScrollArea>

												<FloatingToolbar>
													<FloatingToolbarButtons />
												</FloatingToolbar>

												<CursorOverlay containerRef={containerRef} />
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
					</FocusEditorWrapper>
				</ChatbotProvider>
			</SavingContextProvider>
		</Plate>
	)
}
