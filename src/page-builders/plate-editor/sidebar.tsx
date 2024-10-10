import React from 'react'
import CommentSidebar from '@/page-builders/plate-editor/sidebar-sections/comment-sidebar'
import usePlateStore, { setSidebar } from '@/store/plate-store'
import { X } from 'lucide-react'

import { Button } from '@/components/ui/button'

import AiChatbot from './sidebar-sections/ai-chatbot'
import PlotOutline from './sidebar-sections/plot-outline'

const Sidebar = () => {
	const sidebar = usePlateStore((state) => state.sidebar)

	console.log({ sidebar })

	return (
		<div
			className={`${sidebar ? 'w-fit min-w-[20vw]' : 'hidden'} relative rounded-md pt-4 shadow-editor`}
		>
			<Button
				className="absolute right-1 top-1 z-50"
				variant="ghost"
				size="icon"
				onClick={() => setSidebar(null)}
			>
				<X size={16} />
			</Button>
			{sidebar === 'chatbot' && <AiChatbot />}
			{sidebar === 'comments' && <CommentSidebar />}
			{sidebar === 'outline' && <PlotOutline />}
		</div>
	)
}

export default Sidebar
