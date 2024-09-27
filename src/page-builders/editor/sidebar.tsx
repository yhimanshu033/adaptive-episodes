import React from 'react'
import useEditorStore, { toggleSidebarOPen } from '@/store/editor-store'
import { X } from 'lucide-react'

import { Button } from '@/components/ui/button'

import AiChatbot from './sidebar-sections/ai-chatbot'
import Comments from './sidebar-sections/comments'
import PlotOutline from './sidebar-sections/plot-outline'

const Sidebar = () => {
	const isSidebarOpen = useEditorStore((state) => state.isSidebarOpen)
	const activeSidebar = useEditorStore((state) => state.activeSidebar)

	return (
		<div
			className={`${isSidebarOpen ? 'w-1/5' : 'hidden'} relative rounded-md bg-background-editor p-4 shadow-editor`}
		>
			<Button
				className="absolute right-0 top-0"
				variant="ghost"
				size="icon"
				onClick={() => toggleSidebarOPen(false)}
			>
				<X size={16} />
			</Button>
			{activeSidebar === 'ai' && <AiChatbot />}
			{activeSidebar === 'comments' && <Comments />}
			{activeSidebar === 'outline' && <PlotOutline />}
		</div>
	)
}

export default Sidebar
