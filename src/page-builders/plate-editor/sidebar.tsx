import React, { useEffect } from 'react'
import useComments from '@/hooks/plate/use-comments'
import CommentSidebar from '@/page-builders/plate-editor/sidebar-sections/comment-sidebar'
import usePlateStore, { setSidebar } from '@/store/plate-store'
import { X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'

import AiChatbot from './sidebar-sections/ai-chatbot'
import PlotOutline from './sidebar-sections/plot-outline'

const Sidebar = () => {
	const { resetActiveComments } = useComments()
	const sidebar = usePlateStore((state) => state.sidebar)

	useEffect(() => {
		resetActiveComments()
	}, [sidebar])

	if (!sidebar) return null
	return (
		<ScrollArea
			aria-orientation="vertical"
			className="relative h-[60vh] w-fit min-w-[25vw] rounded-md pt-4"
		>
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
		</ScrollArea>
	)
}

export default Sidebar
