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
	const sidebar = usePlateStore((state) => state.sidebar)
	// if (!sidebar || sidebar === "translation") return null
	const showSidebar = sidebar && sidebar !== 'translation'
	return (
		<ScrollArea
			className={cn(
				'relative h-full flex-1 transition-all duration-200',
				!showSidebar ? 'max-w-0' : 'max-w-[45vw]'
			)}
		>
			{sidebar && renderSidebar[sidebar]}
		</ScrollArea>
	)
}

export default Sidebar
