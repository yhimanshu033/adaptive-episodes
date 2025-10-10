import React, { useEffect } from 'react'
import useScenesMetadataQuery from '@/hooks/query/use-scenes-metadata-query'
import useBeatsheetStore from '@/store/beatsheet-store'
import { useShallow } from 'zustand/react/shallow'

import { Checkbox } from '@/components/aural-ui/checkbox'
import DotLoader from '@/components/aural-ui/dot-loader'
import Label from '@/components/aural-ui/label'
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from '@/components/aural-ui/tabs'
import { BeatSheetEditorContextProvider } from '@/providers/beat-sheet-provider'

import { EBeatSheetEditorTabs } from '@/types/beatsheet-editor-types'

import Characters from './characters'
import SceneTab from './scenes'
import StyleTab from './style'

export default function BeatSheetEditor() {
	const { beatsheetStore, setEnhancementPlan, setScenes } = useBeatsheetStore()

	const enhancementPlan = beatsheetStore(
		useShallow((state) => state.enhancementPlan)
	)

	const { data: sceneData, isLoading: isScenesLoading } =
		useScenesMetadataQuery()

	useEffect(() => {
		if (sceneData && sceneData.result) {
			setScenes(sceneData.result)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [sceneData])

	if (isScenesLoading) {
		return (
			<div className="flex h-full flex-col justify-center">
				<DotLoader />
			</div>
		)
	}

	return (
		<BeatSheetEditorContextProvider>
			<div className="p-4">
				<div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
					<h1 className="text-fm-xl flex-shrink-0 font-bold">
						BeatSheet Editor
					</h1>
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
						<TabsTrigger
							value={EBeatSheetEditorTabs.STYLE}
							className="font-bold"
						>
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
		</BeatSheetEditorContextProvider>
	)
}
