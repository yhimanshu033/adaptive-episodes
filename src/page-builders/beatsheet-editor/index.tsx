import React from 'react'
import useBeatsheetStore from '@/store/beatsheet-store'
import { useShallow } from 'zustand/react/shallow'

import { Checkbox } from '@/components/aural-ui/checkbox'
import Label from '@/components/aural-ui/label'
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from '@/components/aural-ui/tabs'

import { EBeatSheetEditorTabs } from '@/types/beatsheet-editor-types'

import Characters from './characters'
import SceneTab from './scenes'
import StyleTab from './style'

export default function BeatSheetEditor() {
	const { beatsheetStore, setEnhancementPlan } = useBeatsheetStore()

	const enhancementPlan = beatsheetStore(
		useShallow((state) => state.enhancementPlan)
	)

	return (
		<div className="p-4">
			<div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
				<h1 className="text-fm-xl flex-shrink-0 font-bold">BeatSheet Editor</h1>
				<div className="flex items-center gap-2">
					<Label
						htmlFor="enhancement-plan"
						className="text-sm font-medium select-none"
					>
						Enhancement Plan
					</Label>
					<Checkbox
						id="enhancement-plan"
						className="mr-2"
						checked={enhancementPlan}
						onCheckedChange={(checked: boolean | 'indeterminate') =>
							setEnhancementPlan(checked === true)
						}
					/>
				</div>
			</div>
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
						STYLE
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
