import React, { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { TRANSITION_DURATION } from '@/constants/editor-constants'
import { GLOBAL_LOCALIZE } from '@/constants/global-constants'
import AiChatbot from '@/page-builders/plate-editor/sidebar-sections/ai-chatbot'
import CommentSidebar from '@/page-builders/plate-editor/sidebar-sections/comment-sidebar'
import FindAndReplace from '@/page-builders/plate-editor/sidebar-sections/find-and-replace'
import Notes from '@/page-builders/plate-editor/sidebar-sections/notes'
import StoryExplorer from '@/page-builders/plate-editor/sidebar-sections/story-explorer'
import SidebarTopBar from '@/page-builders/plate-editor/sidebar-sections/top-bar'
import useEditorExtendedStore from '@/store/extended-store'
import usePlateStore from '@/store/plate-store'
import { useDebounceValue } from 'usehooks-ts'
import { useShallow } from 'zustand/react/shallow'

import { ResizableHandle, ResizablePanel } from '@/components/ui/resizable'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils/helpers'

import { ESidebar } from '@/types/plate-types'

const renderSidebar: Record<ESidebar, React.ReactNode> = {
	[ESidebar.COMMENTS]: <CommentSidebar />,
	[ESidebar.OUTLINE]: <StoryExplorer />,
	[ESidebar.FAR]: <FindAndReplace />,
	[ESidebar.CHATBOT]: <AiChatbot />,
	[ESidebar.DUAL_VIEW]: null,
	[ESidebar.NOTES]: <Notes />,
}

const Sidebar = () => {
	const { store, setSidebar } = usePlateStore()
	const sidebar = store((state) => state.sidebar)
	const focusMode = store((state) => state.focusMode)
	const showSidebar = sidebar && sidebar !== ESidebar.DUAL_VIEW && !focusMode
	const { setEpisodeNavigationOpen, store: editorExtendedStore } =
		useEditorExtendedStore()
	const episodeNavigationOpen = editorExtendedStore(
		useShallow((state) => state.episodeNavigationOpen)
	)

	const globalLocalize = useSearchParams().get(GLOBAL_LOCALIZE)

	const [debouncedShowSidebarView] = useDebounceValue(
		showSidebar,
		TRANSITION_DURATION
	)
	const [debouncedSidebar] = useDebounceValue(sidebar, TRANSITION_DURATION)

	const isTransitioning =
		(!debouncedShowSidebarView && showSidebar) || !showSidebar

	const sidebarToDisplay = showSidebar ? sidebar : debouncedSidebar

	useEffect(() => {
		if (!sidebar) {
			return
		}
		setEpisodeNavigationOpen(false)
	}, [sidebar, setEpisodeNavigationOpen])

	useEffect(() => {
		if (!episodeNavigationOpen) {
			return
		}
		setSidebar(null)
	}, [episodeNavigationOpen, setSidebar])

	if (
		!!globalLocalize ||
		(!showSidebar && !debouncedShowSidebarView) ||
		sidebar === ESidebar.DUAL_VIEW
	) {
		return null
	}

	return (
		<>
			<ResizableHandle />
			<ResizablePanel
				order={2}
				minSize={30}
				maxSize={50}
				defaultSize={30}
				style={{
					transitionDuration: `${isTransitioning ? TRANSITION_DURATION : 0}ms`,
				}}
				className={cn(
					'sticky top-0 h-svh w-full max-w-full border-b border-r bg-background transition-all',
					!showSidebar && 'max-w-0'
				)}
			>
				{sidebarToDisplay && (
					<ScrollArea className="relative size-full h-full flex-1 transition-all duration-200">
						<div className="h-svh">
							<SidebarTopBar />
							{renderSidebar[sidebarToDisplay]}
						</div>
					</ScrollArea>
				)}
			</ResizablePanel>
		</>
	)
}

export default Sidebar
