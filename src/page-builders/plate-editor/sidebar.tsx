import React from 'react'
import { TRANSITION_DURATION } from '@/constants/editor-constants'
import AiChatbot from '@/page-builders/plate-editor/sidebar-sections/ai-chatbot'
import CommentSidebar from '@/page-builders/plate-editor/sidebar-sections/comment-sidebar'
import FindAndReplace from '@/page-builders/plate-editor/sidebar-sections/find-and-replace'
import StoryExplorer from '@/page-builders/plate-editor/sidebar-sections/story-explorer'
import usePlateStore from '@/store/plate-store'
import { useDebounceValue } from 'usehooks-ts'

import CloseSidebar from '@/components/close-sidebar'
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
}

const Sidebar = () => {
	const { store } = usePlateStore()
	const sidebar = store((state) => state.sidebar)
	const showSidebar = sidebar && sidebar !== ESidebar.DUAL_VIEW

	const [debouncedShowSidebarView] = useDebounceValue(
		showSidebar,
		TRANSITION_DURATION
	)
	const [debouncedSidebar] = useDebounceValue(sidebar, TRANSITION_DURATION)

	const isTransitioning =
		(!debouncedShowSidebarView && showSidebar) || !showSidebar

	const sidebarToDisplay = showSidebar ? sidebar : debouncedSidebar

	if (
		(!showSidebar && !debouncedShowSidebarView) ||
		sidebar === ESidebar.DUAL_VIEW
	)
		return null
	return (
		<>
			<ResizableHandle />
			<ResizablePanel
				order={2}
				minSize={30}
				style={{
					transitionDuration: `${isTransitioning ? TRANSITION_DURATION : 0}ms`,
				}}
				className={cn(
					'sticky top-11 h-fit w-full max-w-full border-b bg-background-editor transition-all',
					!showSidebar && 'max-w-0'
				)}
			>
				{sidebarToDisplay && (
					<ScrollArea className="relative size-full h-[calc(100svh_-_44px)] flex-1 transition-all duration-200">
						<CloseSidebar />
						{renderSidebar[sidebarToDisplay]}
					</ScrollArea>
				)}
			</ResizablePanel>
		</>
	)
}

export default Sidebar
