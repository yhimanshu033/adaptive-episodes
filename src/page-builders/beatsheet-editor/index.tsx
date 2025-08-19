import React from 'react'

import { ScrollArea } from '@/components/aural-ui/scroll-area'
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from '@/components/aural-ui/tabs'
import { ResizableHandle, ResizablePanel } from '@/components/ui/resizable'
import { cn } from '@/lib/aural-ui/utils'

import { EBeatSheetEditorTabs } from '@/types/ai-types'

import Characters from './characrters'
import SceneTab from './scenes'
import StyleTab from './style'

export default function BeatSheetEditor() {
	return (
		<>
			<ResizableHandle />
			<ResizablePanel
				order={2}
				minSize={30}
				maxSize={50}
				defaultSize={30}
				className={cn(
					'bg-fm-surface-primary border-fm-divider-tertiary w-full max-w-full border-r border-b transition-all'
				)}
			>
				<div className="relative flex size-full flex-col transition-all duration-200">
					<ScrollArea
						className="h-full"
						classes={{
							viewport: '[&>div]:min-h-full [&>div]:h-full ',
						}}
					>
						<div className="p-4">
							<h1 className="text-fm-xl mb-4 flex-[0_0_auto] font-bold">
								BeatSheet Editor
							</h1>
							<Tabs defaultValue="scenes" size="sm">
								<TabsList className="mb-4 grid w-full grid-cols-3">
									<TabsTrigger
										value={EBeatSheetEditorTabs.SCENES}
										className="font-bold"
									>
										SCENES
									</TabsTrigger>
									<TabsTrigger
										value={EBeatSheetEditorTabs.CHARACTERS}
										className="font-bold"
									>
										CHARACTERS
									</TabsTrigger>
									<TabsTrigger
										value={EBeatSheetEditorTabs.STYLE}
										className="font-bold"
									>
										Style
									</TabsTrigger>
								</TabsList>
								<TabsContent value={EBeatSheetEditorTabs.SCENES}>
									<SceneTab />
								</TabsContent>
								<TabsContent value={EBeatSheetEditorTabs.CHARACTERS}>
									<Characters />
								</TabsContent>
								<TabsContent value={EBeatSheetEditorTabs.STYLE}>
									<StyleTab />
								</TabsContent>
							</Tabs>
						</div>
					</ScrollArea>
				</div>
			</ResizablePanel>
		</>
	)
}
