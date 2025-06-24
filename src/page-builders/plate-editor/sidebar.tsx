import React from 'react'
import { useSearchParams } from 'next/navigation'
import { TRANSITION_DURATION } from '@/constants/editor-constants'
import { GLOBAL_LOCALIZE } from '@/constants/global-constants'
import AiChatbot from '@/page-builders/plate-editor/sidebar-sections/ai-chatbot'
import CommentSidebar from '@/page-builders/plate-editor/sidebar-sections/comment-sidebar'
import FindAndReplace from '@/page-builders/plate-editor/sidebar-sections/find-and-replace'
import Notes from '@/page-builders/plate-editor/sidebar-sections/notes'
import StoryExplorer from '@/page-builders/plate-editor/sidebar-sections/story-explorer'
import SidebarTopBar from '@/page-builders/plate-editor/sidebar-sections/top-bar'
import usePlateStore from '@/store/plate-store'
import { useDebounceValue } from 'usehooks-ts'

import { ScrollArea } from '@/components/aural-ui/scroll-area'
import { ResizableHandle, ResizablePanel } from '@/components/ui/resizable'
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
	const { store } = usePlateStore()
	const sidebar = store((state) => state.sidebar)
	const focusMode = store((state) => state.focusMode)
	const showSidebar = sidebar && sidebar !== ESidebar.DUAL_VIEW && !focusMode
	const globalLocalize = useSearchParams().get(GLOBAL_LOCALIZE)

	const [debouncedShowSidebarView] = useDebounceValue(
		showSidebar,
		TRANSITION_DURATION
	)
	const [debouncedSidebar] = useDebounceValue(sidebar, TRANSITION_DURATION)

	const isTransitioning =
		(!debouncedShowSidebarView && showSidebar) || !showSidebar

	const sidebarToDisplay = showSidebar ? sidebar : debouncedSidebar

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
