'use client'

import React, { useRef } from 'react'
import { MAIN_EDITOR_ID } from '@/constants/editor-constants'
import useEpisodeContent from '@/hooks/query/use-episode-content'
import { ChatbotProvider } from '@/hooks/use-ai-chatbot'
import useMyEditor from '@/hooks/use-my-editor'
import { SavingContextProvider } from '@/hooks/use-saving'
import DualView from '@/page-builders/plate-editor/dual-view'
import EditorOverlayLoader from '@/page-builders/plate-editor/editor-overlay-loader'
import FocusEditorWrapper from '@/page-builders/plate-editor/focus-mode/editor-wrapper'
import SaveEpisode from '@/page-builders/plate-editor/save-episode'
import Sidebar from '@/page-builders/plate-editor/sidebar'
import ControlButtons from '@/page-builders/plate-editor/split-editor/control-buttons'
import SyncMetaData from '@/page-builders/plate-editor/sync-metadata'
import Title from '@/page-builders/plate-editor/title'
import Versions from '@/page-builders/plate-editor/versions'
import { cn } from '@udecode/cn'
import { Plate } from '@udecode/plate-common/react'

import { Loader } from '@/components/loader'
import { CursorOverlay } from '@/components/plate-ui/cursor-overlay'
import DownloadDocxButton from '@/components/plate-ui/download-docx-button'
import { Editor } from '@/components/plate-ui/editor'
import FixedToolbarComponent from '@/components/plate-ui/fixed-toolbar-component'
import FloatingLaserResponse from '@/components/plate-ui/floating-laser-response'
import FloatingPrompt from '@/components/plate-ui/floating-prompt'
import { FloatingToolbar } from '@/components/plate-ui/floating-toolbar'
import { FloatingToolbarButtons } from '@/components/plate-ui/floating-toolbar-buttons'
import { ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'

import { TCustomComment } from '@/types/editor-types'

export default function PlateEditor() {
	const containerRef = useRef<HTMLDivElement>(null)
	const { data: content, latestStatus, imported } = useEpisodeContent()
	const isChildEpisode = !!content?.chapter.is_deleted
	const editor = useMyEditor({
		content: content?.text || '',
		comments: content?.chapter.props?.comments,
		resolvedComments: (content?.chapter.props?.resolvedComments ||
			[]) as TCustomComment[],
		id: MAIN_EDITOR_ID,
	})

	if (!content || !latestStatus)
		return (
			<div className="flex min-h-[80vh] flex-1 items-center justify-center">
				<Loader />
			</div>
		)

	return (
		<Plate editor={editor}>
			<SavingContextProvider data={content} initialForceSave={imported}>
				<ChatbotProvider>
					<FocusEditorWrapper>
						<div className="container p-4">
							<EditorOverlayLoader />
							<div className="flex animate-fade-in-up items-center justify-between">
								<Title />
								<div className="flex items-center gap-2">
									<DownloadDocxButton latestStatus={latestStatus} />
									<Versions
										isChildEpisode={isChildEpisode}
										latestStatus={latestStatus}
									/>
									<SyncMetaData />
									<SaveEpisode />
								</div>
							</div>
							<div
								ref={containerRef}
								className={cn(
									'relative mt-4 animate-fade-in-up rounded',
									// Block selection
									'[&_.slate-start-area-left]:!w-[64px] [&_.slate-start-area-right]:!w-[64px] [&_.slate-start-area-top]:!h-4'
								)}
							>
								<FixedToolbarComponent />
								<ResizablePanelGroup
									direction="horizontal"
									className="flex size-full !overflow-visible"
								>
									<ResizablePanel
										minSize={30}
										order={1}
										className="w-full flex-1"
									>
										<ResizablePanelGroup
											direction="horizontal"
											className="flex h-full"
										>
											<ResizablePanel
												minSize={30}
												order={1}
												className="flex w-full"
											>
												<Editor
													className="size-full rounded-none"
													autoFocus
													focusRing={false}
													variant="ghost"
													size="md"
												/>

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
							<ControlButtons />
							<FloatingPrompt />
							<FloatingLaserResponse />
						</div>
					</FocusEditorWrapper>
				</ChatbotProvider>
			</SavingContextProvider>
		</Plate>
	)
}
