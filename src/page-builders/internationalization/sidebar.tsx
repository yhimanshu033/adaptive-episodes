import React, { useState } from 'react'
import { ChatbotProvider } from '@/hooks/use-ai-chatbot'
import { createPlateEditor, Plate } from '@udecode/plate-common/react'
import { Bot } from 'lucide-react'

import { Button } from '@/components/plate-ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'

import AIChatbot from '../plate-editor/sidebar-sections/ai-chatbot'

const Sidebar = () => {
	const [isOpen, setOpen] = useState(false)

	return (
		<Plate editor={createPlateEditor()}>
			<ChatbotProvider>
				<div className="absolute right-0 top-0 z-10 flex bg-background py-8 pl-8">
					<Button size="icon" onClick={() => setOpen((prev) => !prev)}>
						<Bot size={24} />
					</Button>
					{isOpen && (
						<ScrollArea className="max-h-[70vh]">
							<AIChatbot />
						</ScrollArea>
					)}
				</div>
			</ChatbotProvider>
		</Plate>
	)
}

export default Sidebar
