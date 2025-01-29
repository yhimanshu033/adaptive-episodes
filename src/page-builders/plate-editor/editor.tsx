'use client'

import React, { useEffect, useRef } from 'react'
import useEpisodeContent from '@/hooks/query/use-episode-content'
import { ChatbotProvider } from '@/hooks/use-ai-chatbot'
import { extendStore } from '@/hooks/use-editor-extend-state'
import useMyEditor from '@/hooks/use-my-editor'
import { SavingContextProvider } from '@/hooks/use-saving'
import OverlayLoader from '@/page-builders/plate-editor/overlay-loader'
import SaveEpisode from '@/page-builders/plate-editor/save-episode'
import Sidebar from '@/page-builders/plate-editor/sidebar'
import SyncMetaData from '@/page-builders/plate-editor/sync-metadata'
import Title from '@/page-builders/plate-editor/title'
import Translation from '@/page-builders/plate-editor/translation'
import Versions from '@/page-builders/plate-editor/versions'
import { useQueryClient } from '@tanstack/react-query'
import { cn } from '@udecode/cn'
import { Plate } from '@udecode/plate-common/react'

import Header from '@/components/header'
import { Loader } from '@/components/loader'
import { CursorOverlay } from '@/components/plate-ui/cursor-overlay'
import DownloadDocxButton from '@/components/plate-ui/download-docx-button'
import { Editor } from '@/components/plate-ui/editor'
import { FixedToolbar } from '@/components/plate-ui/fixed-toolbar'
import { FixedToolbarButtons } from '@/components/plate-ui/fixed-toolbar-buttons'
import FloatingLaserResponse from '@/components/plate-ui/floating-laser-response'
import FloatingPrompt from '@/components/plate-ui/floating-prompt'
import { FloatingToolbar } from '@/components/plate-ui/floating-toolbar'
import { FloatingToolbarButtons } from '@/components/plate-ui/floating-toolbar-buttons'
import { Separator } from '@/components/ui/separator'
import useEpisodeId from '@/providers/episode-id-provider'

import ControlButtons from './split-editor/control-buttons'

export default function PlateEditor() {
	const queryClient = useQueryClient()
	const containerRef = useRef<HTMLDivElement>(null)
	const { data: content, latestStatus, queryKey } = useEpisodeContent()
	const isChildEpisode = !!content?.chapter.is_deleted
	const editor = useMyEditor({
		content: content?.text || '',
		comments: content?.chapter.props?.comments,
		id: 'TEST_ID',
	})
	const episodeId = useEpisodeId()
	const { extended } = extendStore()

	const isLast = episodeId === extended[extended.length - 1]
	const isFirst = episodeId === extended[0]

	useEffect(() => {
		if (extended.length === 1) return
		const invalidate = async () => {
			await queryClient.invalidateQueries({ queryKey })
		}
		void invalidate()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [extended])

	if (!content || !latestStatus)
		return (
			<div className="flex min-h-[80vh] flex-1 items-center justify-center">
				<Loader />
			</div>
		)

	return (
		<Plate editor={editor}>
			<SavingContextProvider data={content}>
				<ChatbotProvider>
					{isFirst && <Header show />}
					<div className="container p-4">
						<OverlayLoader />
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
								'relative mt-4 animate-fade-in-up rounded border bg-background-editor shadow-editor',
								// Block selection
								'[&_.slate-start-area-left]:!w-[64px] [&_.slate-start-area-right]:!w-[64px] [&_.slate-start-area-top]:!h-4'
							)}
						>
							<FixedToolbar>
								<FixedToolbarButtons />
							</FixedToolbar>
							<div className="~h-[78vh] flex size-full">
								<div className="w-full flex-1 bg-background">
									<div className="flex h-full">
										<div className="flex w-full">
											<Editor
												className="size-full rounded-none px-12 py-5"
												autoFocus
												focusRing={false}
												variant="ghost"
												size="md"
											/>

											<FloatingToolbar>
												<FloatingToolbarButtons />
											</FloatingToolbar>

											<CursorOverlay containerRef={containerRef} />
										</div>
										<Translation translatedContent={content.translation_text} />
									</div>
								</div>
								<Sidebar />
							</div>
						</div>
						{isLast ? <ControlButtons /> : <Separator className="mt-8" />}
						<FloatingPrompt />
						<FloatingLaserResponse />
					</div>
				</ChatbotProvider>
			</SavingContextProvider>
		</Plate>
	)
}
