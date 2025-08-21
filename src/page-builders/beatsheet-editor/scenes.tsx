'use client'

import React, { useEffect } from 'react'
import useBeatsheetMutation from '@/hooks/mutation/use-beatsheet-mutation'
import useEditorData from '@/hooks/plate/use-editor-data'
import useBeatSheetEditor from '@/hooks/use-beatsheet-editor'
import useLanguage from '@/hooks/use-language'
import { DndContext, DragOverlay } from '@dnd-kit/core'
import { snapCenterToCursor } from '@dnd-kit/modifiers'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { Plus, Trash2 } from 'lucide-react'

import { Button } from '@/components/aural-ui/button'
import { IconButton } from '@/components/aural-ui/icon-button'
import TextArea from '@/components/aural-ui/textarea'
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion'

import { TScene } from '@/types/ai-types'

import SortableBeat from './sortable-beat'
import { SortableScene } from './sortable-scene'

export default function SceneTab() {
	const {
		sensors,
		scenes,
		openSceneIds,
		activeDragItem,
		setOpenSceneIds,
		handleDragEnd,
		handleDragStart,
		handleDelete,
		handleInput,
		handleGenerateScenes,
		handleDragOver,
		addNewBeat,
		addNewScene,
		fixCursorSnapOffset,
		getSceneText,
	} = useBeatSheetEditor()

	const { editorText } = useEditorData()
	const language = useLanguage()

	const {
		data: generatedBeatsheetContent,
		isPending,
		mutate: generateBeatsheet,
	} = useBeatsheetMutation()

	const handleGenerateTask = (scenes: TScene[]) => {
		generateBeatsheet({
			beats: Object.fromEntries(scenes.map((scene) => [scene.id, scene.beats])),
			ep_text: editorText,
			language,
			scene_texts: Object.fromEntries(
				scenes.map((scene) => [scene.id, getSceneText(scene.id)])
			),
		})
	}

	useEffect(() => {
		if (!generatedBeatsheetContent) {
			return
		}
		handleGenerateScenes(
			generatedBeatsheetContent,
			generatedBeatsheetContent.map((scene) => scene.id)
		)
	}, [generatedBeatsheetContent, handleGenerateScenes])

	return (
		<>
			<DndContext
				sensors={sensors}
				collisionDetection={fixCursorSnapOffset}
				onDragEnd={handleDragEnd}
				onDragStart={handleDragStart}
				onDragOver={handleDragOver}
			>
				<SortableContext
					items={scenes.map((scene) => scene.id)}
					strategy={verticalListSortingStrategy}
				>
					<Accordion
						type="multiple"
						className="w-full"
						value={openSceneIds}
						onValueChange={setOpenSceneIds}
					>
						{scenes.map((scene, idx) => (
							<SortableScene key={scene.id} id={scene.id}>
								<AccordionItem key={idx} value={scene.id}>
									<AccordionTrigger className="flex items-center">
										<div className="flex flex-1 items-center justify-between">
											<h3 className="w-full font-bold">{scene.title}</h3>
											<IconButton
												label="Delete Scene"
												icon={<Trash2 size={18} />}
												onClick={() => handleDelete(scene.id)}
												variant="ghost"
												size="small"
											/>
										</div>
									</AccordionTrigger>
									<SortableContext
										items={scene.beats.map((beat) => beat.id)}
										strategy={verticalListSortingStrategy}
									>
										<AccordionContent className="space-y-2">
											{scene.beats.map((beat) => (
												<SortableBeat key={beat.id} id={beat.id}>
													<TextArea
														value={beat.content}
														onChange={(e) =>
															handleInput(scene.id, beat.id, e.target.value)
														}
													/>
												</SortableBeat>
											))}
											<div className="flex items-center justify-between">
												<Button
													variant="outline"
													size="sm"
													onClick={() => addNewBeat(scene.id)}
												>
													<Plus size={16} className="mr-1" /> Add Beat
												</Button>
												<Button
													disabled={isPending}
													onClick={() => handleGenerateTask([scene])}
													size={'sm'}
												>
													Generate
												</Button>
											</div>
										</AccordionContent>
									</SortableContext>
								</AccordionItem>
							</SortableScene>
						))}
					</Accordion>
				</SortableContext>
				{activeDragItem?.type === 'beat' && (
					<DragOverlay modifiers={[snapCenterToCursor]}>
						<div>
							<div className="rounded-md border p-3">
								<h4 className="mb-2 text-sm font-bold">
									BEAT {activeDragItem.id}
								</h4>
								<p className="bg-background text-muted-foreground rounded-md p-2 text-sm whitespace-pre-wrap">
									{scenes
										.flatMap((s) => s.beats)
										.find((b) => b.id === activeDragItem.id)?.content ?? '...'}
								</p>
							</div>
						</div>
					</DragOverlay>
				)}
			</DndContext>

			<div className="mt-2 flex items-center justify-between">
				<Button onClick={addNewScene}>
					<Plus size={18} className="mr-1" /> ADD Scene
				</Button>
				<Button disabled={isPending} onClick={() => handleGenerateTask(scenes)}>
					Generate All
				</Button>
			</div>
		</>
	)
}
