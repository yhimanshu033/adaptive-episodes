'use client'

import React, { useCallback, useMemo } from 'react'
import { useParams } from 'next/navigation'
import useBeatSheetStreamingMutation from '@/hooks/mutation/use-beat-sheet-streaming-mutation'
import useEditorData from '@/hooks/plate/use-editor-data'
import useEpisodeContent from '@/hooks/query/use-episode-content'
import useLanguage from '@/hooks/use-language'
import { beatsheetContextEnglish } from '@/mock-data/beatsheet-editor'
import SceneItem from '@/page-builders/beatsheet-editor/scene-item'
import UndoRedoButtons from '@/page-builders/beatsheet-editor/undo-redo-buttons'
import useBeatsheetStore from '@/store/beatsheet-store'
import { DndContext, DragOverlay } from '@dnd-kit/core'
import { snapCenterToCursor } from '@dnd-kit/modifiers'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { Loader2, Plus } from 'lucide-react'
import { useShallow } from 'zustand/react/shallow'

import { Button } from '@/components/aural-ui/button'
import { If } from '@/components/aural-ui/if-else'
import { Accordion } from '@/components/ui/accordion'
import useBeatSheetEditor from '@/providers/beat-sheet-provider'
import {
	convertScenesArrayToMap,
	isOrderSceneOrderChange,
} from '@/lib/utils/helpers'

import { TScene } from '@/types/beatsheet-editor-types'

export default function SceneTab() {
	const {
		sensors,
		handleDragEnd,
		handleDragStart,
		handleDelete,
		handleInput,
		handleGenerateScenes,
		handleDragOver,
		fixCursorSnapOffset,
		getSceneText,
		oldScenes,
		setOldScenes,
		handleStartBeatSheetGeneration,
		generatedContent,
		getSceneRemainingTime,
		getSceneTimedOut,
		rejectContent,
		currentlyGeneratingSceneTaskId,
		getSceneLogs,
	} = useBeatSheetEditor()

	const language = useLanguage()
	const { id } = useParams()
	const { data: episodeData } = useEpisodeContent()

	const {
		beatsheetStore,
		setOpenSceneIds,
		addNewBeat,
		addNewScene,
		setOpenPromptId,
	} = useBeatsheetStore()

	const {
		characters,
		enhancementPlan,
		scenes,
		openSceneIds,
		activeDragItem,
		openPromptId,
	} = beatsheetStore(
		useShallow((state) => ({
			characters: state.characters,
			enhancementPlan: state.enhancementPlan,
			scenes: state.scenes,
			openSceneIds: state.openSceneIds,
			activeDragItem: state.activeDragItem,
			openPromptId: state.openPromptId,
		}))
	)

	const { editorText } = useEditorData()

	const { mutateAsync: generateBeatsheet } = useBeatSheetStreamingMutation()

	const generatingSceneCount = useMemo(() => {
		return Object.keys(currentlyGeneratingSceneTaskId).length
	}, [currentlyGeneratingSceneTaskId])

	const isGeneratingAll = useMemo(() => {
		return generatingSceneCount === scenes.length
	}, [generatingSceneCount, scenes.length])

	const handleGenerateTask = useCallback(
		async (scenes: { data: TScene; index: number }[], prompt?: string) => {
			const taskId = await generateBeatsheet({
				params: {
					beats: Object.fromEntries(
						scenes.map((scene) => [
							`scene_${scene.index + 1}`,
							scene.data.beats,
						])
					),
					beats_old: Object.fromEntries(
						scenes.map((scene) => [
							`scene_${scene.index + 1}`,
							convertScenesArrayToMap(oldScenes)[scene.data.id]?.beats,
						])
					),
					order_change: isOrderSceneOrderChange(
						scenes.map((s) => convertScenesArrayToMap(oldScenes)[s.data.id]),
						scenes.map((s) => s.data)
					),
					ep_text: editorText,
					input_language: language,
					scene_texts: Object.fromEntries(
						scenes.map((scene) => [
							`scene_${scene.index + 1}`,
							getSceneText(scene.data.id),
						])
					),
					characters,
					context: beatsheetContextEnglish,
					use_enhancement_plan: enhancementPlan,
					project_id: Number(id),
					episode_number: Number(episodeData?.chapter.seq_number),
					...(prompt ? { scene_wide_prompt: prompt } : {}),
				},
			})
			const sceneIds = scenes.map((scene) => scene.data.id)
			handleStartBeatSheetGeneration({ sceneIds, taskId })
		},
		[
			handleStartBeatSheetGeneration,
			enhancementPlan,
			episodeData,
			oldScenes,
			characters,
			editorText,
			generateBeatsheet,
			getSceneText,
			id,
			language,
		]
	)

	const handleApproveContent = useCallback(
		(sceneId: string) => {
			const pendingContent = generatedContent[sceneId]
			if (pendingContent) {
				handleGenerateScenes(pendingContent, sceneId)
				const newScenes = [...oldScenes]
				const changedIdx = newScenes.findIndex((item) => item.id === sceneId)
				const changedScene = scenes.find((scene) => scene.id === sceneId)
				if (!changedScene || changedIdx === -1) {
					return
				}
				newScenes[changedIdx] = changedScene
				setOldScenes(newScenes)
			}
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[generatedContent, handleGenerateScenes, oldScenes, scenes]
	)

	return (
		<>
			<UndoRedoButtons />
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
							<SceneItem
								logs={getSceneLogs(scene.id)}
								hasTimeoutError={!!getSceneTimedOut(scene.id)}
								idx={idx}
								isGenerating={!!currentlyGeneratingSceneTaskId[scene.id]}
								pendingContent={generatedContent[scene.id]}
								isPendingApproval={!!generatedContent[scene.id]}
								onAccept={() => handleApproveContent(scene.id)}
								onDelete={() => handleDelete(scene.id)}
								onGenerate={(prompt) =>
									void handleGenerateTask([{ data: scene, index: idx }], prompt)
								}
								onInput={(beatId, data) => handleInput(scene.id, beatId, data)}
								onNewBeat={() => addNewBeat(scene.id)}
								onOpenPrompt={() => {
									if (!openSceneIds.includes(scene.id)) {
										setOpenSceneIds([...openSceneIds, scene.id])
									}
									setOpenPromptId(scene.id)
								}}
								onPromptClose={() => setOpenPromptId(null)}
								onReject={() => rejectContent(scene.id)}
								openPromptId={openPromptId}
								remainingTime={getSceneRemainingTime(scene.id)}
								scene={scene}
								key={idx}
							/>
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

			<div className="mt-4 flex items-center justify-between">
				<Button size="sm" onClick={addNewScene}>
					<Plus size={18} className="mr-1" /> ADD Scene
				</Button>
				<Button
					disabled={isGeneratingAll}
					isDisabled={isGeneratingAll}
					onClick={() =>
						void handleGenerateTask(
							scenes
								.filter((item) => !currentlyGeneratingSceneTaskId[item.id])
								.map((scene, index) => ({ data: scene, index }))
						)
					}
					size="sm"
				>
					<If condition={isGeneratingAll}>
						<Loader2 size={18} className="mr-1 animate-spin" />
					</If>
					Generate All
				</Button>
			</div>
		</>
	)
}
