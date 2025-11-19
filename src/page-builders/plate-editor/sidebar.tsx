import React, { useEffect, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import { TRANSITION_DURATION } from '@/constants/editor-constants'
import { GLOBAL_LOCALIZE } from '@/constants/global-constants'
import {
	AIChatbot,
	CommentSidebar,
	FindAndReplace,
	Notes,
	SidebarTopBar,
	StoryExplorer,
} from '@/page-builders/plate-editor/sidebar-sections'
import Outliner from '@/page-builders/plate-editor/sidebar-sections/outliner'
import useOutlinerEnabled from '@/page-builders/plate-editor/sidebar-sections/outliner/hooks/use-outliner-enabled'
import { useEditorStore } from '@/store/editor-store'
import usePlateStore from '@/store/plate-store'
import { usePluginOption } from 'platejs/react'
import { useDebounceValue } from 'usehooks-ts'
import { useShallow } from 'zustand/react/shallow'

import { ScrollArea } from '@/components/aural-ui/scroll-area'
import { commentPlugin } from '@/components/editor/plugins/comment-kit'
import { ResizableHandle, ResizablePanel } from '@/components/ui/resizable'
import useConfiguration from '@/providers/configuration-provider'
import { cn } from '@/lib/utils/helpers'

import { ESidebar } from '@/types/plate-types'

import BeatSheetEditor from '../beatsheet-editor'

const renderSidebar: Record<ESidebar, React.ReactNode> = {
	[ESidebar.COMMENTS]: <CommentSidebar />,
	[ESidebar.OUTLINE]: <StoryExplorer />,
	[ESidebar.FAR]: <FindAndReplace />,
	[ESidebar.CHATBOT]: <AIChatbot />,
	[ESidebar.DUAL_VIEW]: null,
	[ESidebar.NOTES]: <Notes />,
	[ESidebar.BEAT_SHEET]: <BeatSheetEditor />,
	[ESidebar.OUTLINER]: <Outliner />,
}

const Sidebar = () => {
	const { store, setSidebar } = usePlateStore()
	const sidebar = store((state) => state.sidebar)
	const focusMode = store((state) => state.focusMode)
	const showSidebar = sidebar && sidebar !== ESidebar.DUAL_VIEW && !focusMode
	const globalLocalize = useSearchParams().get(GLOBAL_LOCALIZE)
	const activeCommentId = usePluginOption(commentPlugin, 'activeId')
	const isOutlinerEnabled = useOutlinerEnabled()

	const { configurationData } = useConfiguration()

	const isEpisodeNavigationOpen = useEditorStore(
		useShallow((state) => state.isEpisodeNavigationOpen)
	)
	const [debouncedShowSidebarView] = useDebounceValue(
		showSidebar,
		TRANSITION_DURATION
	)
	const [debouncedSidebar] = useDebounceValue(sidebar, TRANSITION_DURATION)

	const sidebarChanged = useMemo(() => {
		return sidebar !== debouncedSidebar
	}, [debouncedSidebar, sidebar])

	const isTransitioning =
		(!debouncedShowSidebarView && showSidebar) || !showSidebar

	const sidebarToDisplay = showSidebar ? sidebar : debouncedSidebar

	useEffect(() => {
		if (activeCommentId && sidebar !== ESidebar.COMMENTS) {
			setSidebar(ESidebar.COMMENTS)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [activeCommentId])

	useEffect(() => {
		if (!isEpisodeNavigationOpen) {
			return
		}
		setSidebar(null)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isEpisodeNavigationOpen])

	useEffect(() => {
		if (isOutlinerEnabled) {
			setSidebar(ESidebar.OUTLINER)
			return
		}
		if (configurationData?.defaultSidebar) {
			setSidebar(configurationData.defaultSidebar)
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [configurationData.defaultSidebar, isOutlinerEnabled])

	if (sidebar === ESidebar.DUAL_VIEW) {
		return null
	}

	if (!!globalLocalize || (!showSidebar && !debouncedShowSidebarView)) {
		return <div className="w-6" />
	}

	return (
		<>
			<ResizableHandle />
			<ResizablePanel
				order={2}
				minSize={sidebarChanged && sidebar === ESidebar.OUTLINER ? 50 : 30}
				maxSize={50}
				defaultSize={30}
				style={{
					transitionDuration: `${isTransitioning ? TRANSITION_DURATION : 0}ms`,
				}}
				className={cn(
					'bg-fm-surface-primary border-fm-divider-tertiary w-full max-w-full border-r border-b transition-all',
					!showSidebar && 'max-w-0'
				)}
			>
				{sidebarToDisplay && (
					<div className="relative flex size-full flex-col transition-all duration-200">
						<ScrollArea
							className="h-full"
							classes={{
								viewport: '[&>div]:min-h-full [&>div]:h-full ',
							}}
						>
							<div className="flex h-full flex-col">
								<SidebarTopBar />
								<div className="flex flex-1 flex-col">
									{renderSidebar[sidebarToDisplay]}
								</div>
							</div>
						</ScrollArea>
					</div>
				)}
			</ResizablePanel>
		</>
	)
}

export default Sidebar
