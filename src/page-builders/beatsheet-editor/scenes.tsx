'use client'

import React, { useCallback } from 'react'
import { useParams } from 'next/navigation'
import useBeatSheetStreamingMutation from '@/hooks/mutation/use-beat-sheet-streaming-mutation'
import useEditorData from '@/hooks/plate/use-editor-data'
import useEpisodeContent from '@/hooks/query/use-episode-content'
import useLanguage from '@/hooks/use-language'
import { SparklesSoftIcon } from '@/icons/sparkles-soft-icon'
import { beatsheetContextEnglish } from '@/mock-data/beatsheet-editor'
import UndoRedoButtons from '@/page-builders/beatsheet-editor/undo-redo-buttons'
import useBeatsheetStore from '@/store/beatsheet-store'
import { DndContext, DragOverlay } from '@dnd-kit/core'
import { snapCenterToCursor } from '@dnd-kit/modifiers'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { Check, Loader2, Plus, Trash2, X } from 'lucide-react'
import { useShallow } from 'zustand/react/shallow'

import { Button } from '@/components/aural-ui/button'
import { IconButton } from '@/components/aural-ui/icon-button'
import { If } from '@/components/aural-ui/if-else'
import TextArea from '@/components/aural-ui/textarea'
import { Typography } from '@/components/aural-ui/typography'
import ScenePromptInline from '@/components/beatsheet-editor/scene-prompt-inline'
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion'
import useBeatSheetEditor from '@/providers/beat-sheet-provider'
import {
	convertScenesArrayToMap,
	isOrderSceneOrderChange,
} from '@/lib/utils/helpers'

import {
	TGenerateBeatsheetResponseItem,
	TScene,
} from '@/types/beatsheet-editor-types'

import GenerationStatusBar from './generation-status-bar'
import SortableBeat from './sortable-beat'
import { SortableScene } from './sortable-scene'

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

	const { isPending, mutateAsync: generateBeatsheet } =
		useBeatSheetStreamingMutation()

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
			console.log({ taskId })
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
			{/* <GenerationStatusBar
				isPending={isPending}
				hasTimeoutError={!!hasTimeoutError}
				generatingSceneIds={generatingSceneIds}
				totalScenes={scenes.length}
				remainingTime={remainingTime}
			/> */}
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
							<SceneContent
								hasTimeoutError={!!getSceneTimedOut(scene.id)}
								idx={idx}
								isAnyGenerating={
									Object.keys(currentlyGeneratingSceneTaskId).length > 0
								}
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
				<Button onClick={addNewScene} disabled={isPending}>
					<Plus size={18} className="mr-1" /> ADD Scene
				</Button>
				<Button
					disabled={isPending}
					onClick={() =>
						void handleGenerateTask(
							scenes.map((scene, index) => ({ data: scene, index }))
						)
					}
				>
					{isPending &&
					Object.keys(currentlyGeneratingSceneTaskId).length ===
						scenes.length ? (
						<>
							<Loader2 size={18} className="mr-1 animate-spin" />
							Generating All...
						</>
					) : (
						'Generate All'
					)}
				</Button>
			</div>
		</>
	)
}

interface SceneContentProps {
	hasTimeoutError: boolean
	idx: number
	isAnyGenerating: boolean
	isGenerating: boolean
	isPendingApproval: boolean
	onAccept: () => void
	onDelete: () => void
	onGenerate: (prompt?: string) => void
	onInput: (beatId: string, data: string) => void
	onNewBeat: () => void
	onOpenPrompt: () => void
	onPromptClose: () => void
	onReject: () => void
	openPromptId: string | null
	pendingContent: TGenerateBeatsheetResponseItem
	remainingTime: number
	scene: TScene
}
function SceneContent({
	idx,
	isAnyGenerating,
	isGenerating,
	isPendingApproval,
	onDelete,
	onOpenPrompt,
	pendingContent,
	scene,
	hasTimeoutError,
	remainingTime,
	onAccept,
	onGenerate,
	onReject,
	openPromptId,
	onPromptClose,
	onInput,
	onNewBeat,
}: SceneContentProps) {
	return (
		<SortableScene key={scene.id} id={scene.id}>
			<AccordionItem key={idx} value={scene.id}>
				<AccordionTrigger className="flex items-center">
					<div className="flex flex-1 items-center justify-between">
						<div className="flex items-center gap-2">
							<h3 className="font-bold">{scene.title}</h3>
						</div>
						<div className="flex items-center justify-center gap-2">
							<IconButton
								label="Scene Prompt"
								icon={<SparklesSoftIcon />}
								onClick={(e) => {
									e.stopPropagation()
									onOpenPrompt()
								}}
								variant="ghost"
								size="small"
								disabled={isGenerating}
							/>
							<IconButton
								label="Delete Scene"
								icon={<Trash2 size={18} />}
								onClick={(e) => {
									e.stopPropagation()
									onDelete()
								}}
								variant="ghost"
								size="small"
								disabled={isGenerating}
							/>
						</div>
					</div>
				</AccordionTrigger>
				<SortableContext
					items={scene.beats.map((beat) => beat.id)}
					strategy={verticalListSortingStrategy}
				>
					<AccordionContent className="relative space-y-2">
						<If condition={isGenerating}>
							<GenerationStatusBar
								isPending={isGenerating}
								hasTimeoutError={hasTimeoutError}
								generatingSceneIds={[scene.id]}
								totalScenes={1}
								remainingTime={remainingTime}
							/>
						</If>
						{isPendingApproval && (
							<div className="bg-background/80 absolute inset-0 z-15 flex flex-col backdrop-blur-sm">
								<div className="flex-1 overflow-y-auto p-4">
									<Typography
										as="span"
										key={pendingContent.id}
										className="whitespace-pre-wrap"
										variant="body-small"
									>
										{pendingContent.content}
									</Typography>
								</div>
								<div className="flex justify-between gap-2 p-4">
									<Button
										size="sm"
										variant="outline"
										onClick={() => onReject()}
										className="flex items-center gap-1"
									>
										<X size={16} />
										Reject
									</Button>
									<Button
										size="sm"
										onClick={() => onAccept()}
										className="flex items-center gap-1"
										variant="outline"
									>
										<Check size={16} />
										Accept
									</Button>
								</div>
							</div>
						)}
						<ScenePromptInline
							isOpen={openPromptId === scene.id}
							onClose={() => onPromptClose()}
							onSubmit={(prompt) => onGenerate(prompt)}
						/>
						{scene.beats.map((beat, index) => (
							<SortableBeat key={beat.id} id={beat.id} index={index}>
								<TextArea
									value={beat.content || 'No content'}
									onChange={(e) => onInput(beat.id, e.target.value)}
									disabled={isGenerating}
								/>
							</SortableBeat>
						))}
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-2">
								<Button
									variant="outline"
									size="sm"
									onClick={() => onNewBeat()}
									disabled={isGenerating}
								>
									<Plus size={16} className="mr-1" /> Add Beat
								</Button>
							</div>
							<Button
								disabled={isAnyGenerating}
								onClick={() => onGenerate()}
								size={'sm'}
							>
								{isGenerating ? (
									<>
										<Loader2 size={16} className="mr-1 animate-spin" />
										Generating...
									</>
								) : (
									'Generate'
								)}
							</Button>
						</div>
					</AccordionContent>
				</SortableContext>
			</AccordionItem>
		</SortableScene>
	)
}
