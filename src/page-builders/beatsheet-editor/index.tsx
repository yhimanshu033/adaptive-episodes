import React from 'react'

import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from '@/components/aural-ui/tabs'

import { EBeatSheetEditorTabs } from '@/types/ai-types'

import Characters from './characrters'
import SceneTab from './scenes'
import StyleTab from './style'

export default function BeatSheetEditor() {
	return (
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
					<TabsTrigger value={EBeatSheetEditorTabs.STYLE} className="font-bold">
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
	)
}
