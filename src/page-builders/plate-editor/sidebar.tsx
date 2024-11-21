import React from 'react'
import CommentSidebar from '@/page-builders/plate-editor/sidebar-sections/comment-sidebar'
import usePlateStore, { setSidebar } from '@/store/plate-store'
import { X } from 'lucide-react'
import { useShallow } from 'zustand/react/shallow'

import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'

import AiChatbot from './sidebar-sections/ai-chatbot'
import FindAndReplace from './sidebar-sections/find-and-replace'
import StoryExplorer from './sidebar-sections/story-explorer'

const Sidebar = () => {
	const sidebar = usePlateStore(useShallow((state) => state.sidebar))

	if (!sidebar) return null

	const renderSidebar: Record<typeof sidebar, React.ReactNode> = {
		chatbot: <AiChatbot />,
		comments: <CommentSidebar />,
		outline: <StoryExplorer />,
		far: <FindAndReplace />,
	}

	return (
		<ScrollArea className="relative h-[58vh] w-fit min-w-[25vw] flex-1">
			<Button
				className="absolute right-2 top-1 z-50"
				variant="ghost"
				size="icon"
				onClick={() => setSidebar(null)}
			>
				<X size={16} />
			</Button>
			{renderSidebar[sidebar]}
		</ScrollArea>
	)
}

export default Sidebar
