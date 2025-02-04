import React from 'react'
import AiChatbot from '@/page-builders/plate-editor/sidebar-sections/ai-chatbot'
import CommentSidebar from '@/page-builders/plate-editor/sidebar-sections/comment-sidebar'
import FindAndReplace from '@/page-builders/plate-editor/sidebar-sections/find-and-replace'
import Notes from '@/page-builders/plate-editor/sidebar-sections/notes'
import StoryExplorer from '@/page-builders/plate-editor/sidebar-sections/story-explorer'
import usePlateStore from '@/store/plate-store'

import CloseSidebar from '@/components/close-sidebar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils/helpers'

import { ESidebar } from '@/types/plate-types'

const renderSidebar: Record<ESidebar, React.ReactNode> = {
	comments: <CommentSidebar />,
	outline: <StoryExplorer />,
	far: <FindAndReplace />,
	chatbot: <AiChatbot />,
	notes: <Notes />,
	translation: null,
	local_diff: null,
}

const Sidebar = () => {
	const { store } = usePlateStore()
	const sidebar = store((state) => state.sidebar)
	const showSidebar =
		sidebar &&
		sidebar !== ESidebar.TRANSLATION &&
		sidebar !== ESidebar.LOCAL_DIFF
	return (
		<div
			className={cn(
				'sticky top-11 h-fit w-full max-w-[700px] border-b transition-all',
				!showSidebar ? 'w-0' : 'w-[45vw]'
			)}
		>
			<ScrollArea className="relative size-full h-[calc(100svh_-_44px)] flex-1 transition-all duration-200">
				<CloseSidebar />
				{sidebar && renderSidebar[sidebar]}
			</ScrollArea>
		</div>
	)
}

export default Sidebar
