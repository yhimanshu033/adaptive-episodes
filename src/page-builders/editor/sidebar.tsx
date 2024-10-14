import React from 'react'
import useEditorStore, { toggleSidebarOPen } from '@/store/editor-store'
import { X } from 'lucide-react'

import { Button } from '@/components/ui/button'

import AIChatbot from './sidebar-sections/ai-chatbot'
import Comments from './sidebar-sections/comments'
import PlotOutline from './sidebar-sections/plot-outline'

const Sidebar = () => {
	const isSidebarOpen = useEditorStore((state) => state.isSidebarOpen)
	const activeSidebar = useEditorStore((state) => state.activeSidebar)

	return (
		<div
			className={`${!isSidebarOpen && 'hidden'} relative flex-1 border-l bg-background-editor`}
		>
			<Button
				className="absolute right-0 top-0"
				variant="ghost"
				size="icon"
				onClick={() => toggleSidebarOPen(false)}
			>
				<X size={16} />
			</Button>
			{activeSidebar === 'ai' && <AIChatbot />}
			{activeSidebar === 'comments' && <Comments />}
			{activeSidebar === 'outline' && <PlotOutline />}
		</div>
	)
}

export default Sidebar
