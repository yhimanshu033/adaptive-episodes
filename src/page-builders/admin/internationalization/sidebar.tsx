import React, { useState } from 'react'
// import { MOCK_EPISODE } from '@/mock-data/admin'
import { Bot } from 'lucide-react'

// import { createPlateEditor, Plate } from 'platejs/react'

import { Button } from '@/components/plate-ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'

const Sidebar = () => {
	const [isOpen, setOpen] = useState(false)

	return (
		<>
			{/* <Plate editor={createPlateEditor()}> */}
			{/* <ChatbotProvider episodeContent={MOCK_EPISODE}> */}
			<div className="bg-background absolute top-0 right-0 z-10 flex py-8 pl-8">
				<Button size="icon" onClick={() => setOpen((prev) => !prev)}>
					<Bot size={24} />
				</Button>
				{isOpen && (
					<ScrollArea className="max-h-screen">
						{/* <AIChatbot /> */}
					</ScrollArea>
				)}
			</div>
			{/* </ChatbotProvider> */}
			{/* </Plate> */}
		</>
	)
}

export default Sidebar
