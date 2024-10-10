import React, { useEffect } from 'react'
import useComments from '@/hooks/plate/use-comments'
import CommentSidebar from '@/page-builders/plate-editor/sidebar-sections/comment-sidebar'
import usePlateStore, { setSidebar } from '@/store/plate-store'
import { X } from 'lucide-react'

import { Button } from '@/components/ui/button'

import AiChatbot from './sidebar-sections/ai-chatbot'
import PlotOutline from './sidebar-sections/plot-outline'

const Sidebar = () => {
	const { resetActiveComments } = useComments()
	const sidebar = usePlateStore((state) => state.sidebar)

	useEffect(() => {
		resetActiveComments()
	}, [resetActiveComments, sidebar])

	if (!sidebar) return null
	return (
		<div className="relative w-fit flex-1 rounded-md">
			<Button
				className="absolute right-2 top-1 z-50"
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
