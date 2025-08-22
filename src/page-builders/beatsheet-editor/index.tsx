import React, { useState } from 'react'
import { charactersData, TCharacter } from '@/mock-data/beatsheet-editor'

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
	const [characters, setCharacters] = useState<TCharacter[]>(charactersData)

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
						STYLE
					</TabsTrigger>
				</TabsList>
				<TabsContent value={EBeatSheetEditorTabs.SCENES}>
					<SceneTab characters={characters} />
				</TabsContent>
				<TabsContent value={EBeatSheetEditorTabs.CHARACTERS}>
					<Characters characters={characters} setCharacters={setCharacters} />
				</TabsContent>
				<TabsContent value={EBeatSheetEditorTabs.STYLE}>
					<StyleTab />
				</TabsContent>
			</Tabs>
		</div>
	)
}
