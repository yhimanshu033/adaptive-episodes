import React from 'react'
import CommentSidebar from '@/page-builders/plate-editor/sidebar-sections/comment-sidebar'
import usePlateStore from '@/store/plate-store'

import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'

import AiChatbot from './sidebar-sections/ai-chatbot'
import FindAndReplace from './sidebar-sections/find-and-replace'
import StoryExplorer from './sidebar-sections/story-explorer'

const renderSidebar: Record<string, React.ReactNode> = {
	chatbot: <AiChatbot />,
	comments: <CommentSidebar />,
	outline: <StoryExplorer />,
	far: <FindAndReplace />,
}

const Sidebar = () => {
	const { store } = usePlateStore()
	const sidebar = store((state) => state.sidebar)
	const showSidebar = sidebar && sidebar !== 'translation'
	return (
		<div
			className={cn(
				'sticky top-11 h-fit w-full border-b',
				!showSidebar ? 'max-w-0' : 'max-w-[45vw]'
			)}
		>
			<ScrollArea className="relative size-full h-[calc(100svh_-_44px)] flex-1 transition-all duration-200">
				{sidebar && renderSidebar[sidebar]}
			</ScrollArea>
		</div>
	)
}

export default Sidebar
