import React from 'react'
import OutlinerChatMessagesList from '@/page-builders/plate-editor/sidebar-sections/outliner/outliner-chat-message-list'
import OutlinerPromptInput from '@/page-builders/plate-editor/sidebar-sections/outliner/outliner-chat-prompt'

import { Divider } from '@/components/aural-ui/divider'
import Image from '@/components/ui/image'
import { ResizableHandle, ResizablePanel } from '@/components/ui/resizable'

export default function GenerateTab() {
	return (
		<>
			<ResizableHandle />
			<ResizablePanel
				order={2}
				minSize={30}
				defaultSize={30}
				className="relative flex flex-col overflow-hidden border-t"
			>
				<Image
					alt="story chat gradient"
					className="pointer-events-none absolute top-0 right-0 z-0"
					src="/assets/story-chat-bg-gradient.png"
				/>
				<OutlinerChatMessagesList />
				<Divider className="mb-3 opacity-80" variant="secondary" />
				<div className="px-4 pb-4">
					<OutlinerPromptInput />
				</div>
			</ResizablePanel>
		</>
	)
}
