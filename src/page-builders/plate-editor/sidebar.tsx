import React from 'react'
import CommentSidebar from '@/page-builders/plate-editor/sidebar-sections/comment-sidebar'
import usePlateStore from '@/store/plate-store'

import { ScrollArea } from '@/components/ui/scroll-area'

import AiChatbot from './sidebar-sections/ai-chatbot'
import FindAndReplace from './sidebar-sections/find-and-replace'
import StoryExplorer from './sidebar-sections/story-explorer'

const Sidebar = () => {
	const sidebar = usePlateStore((state) => state.sidebar)

	if (!sidebar) return null

	const renderSidebar: Record<typeof sidebar, React.ReactNode> = {
		chatbot: <AiChatbot />,
		comments: <CommentSidebar />,
		outline: <StoryExplorer />,
		far: <FindAndReplace />,
	}

	return (
		<ScrollArea className="relative h-full w-fit min-w-[25vw] flex-1">
			{renderSidebar[sidebar]}
		</ScrollArea>
	)
}

export default Sidebar
