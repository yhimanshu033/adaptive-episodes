'use client'

import React from 'react'
import { useParams } from 'next/navigation'
import useBeatsheetMutation from '@/hooks/mutation/use-beatsheet-mutation'
import useEditorData from '@/hooks/plate/use-editor-data'
import useEpisodeContent from '@/hooks/query/use-episode-content'
import useBeatSheetEditor from '@/hooks/use-beatsheet-editor'
import useLanguage from '@/hooks/use-language'
// import useLanguage from '@/hooks/use-language'
import { beatsheetContextEnglish } from '@/mock-data/beatsheet-editor'
import useBeatsheetStore from '@/store/beatsheet-store'
import { DndContext, DragOverlay } from '@dnd-kit/core'
import { snapCenterToCursor } from '@dnd-kit/modifiers'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { Check, Loader2, Plus, Trash2, X } from 'lucide-react'
import { useShallow } from 'zustand/react/shallow'

import { Button } from '@/components/aural-ui/button'
import CircularLoader from '@/components/aural-ui/circular-loader'
import { IconButton } from '@/components/aural-ui/icon-button'
import TextArea from '@/components/aural-ui/textarea'
import { Typography } from '@/components/aural-ui/typography'
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion'

import { TScene } from '@/types/beatsheet-editor-types'

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
	} = useBeatSheetEditor()

	const language = useLanguage()
	const { id } = useParams()
	const { data: episodeData } = useEpisodeContent()

	const { beatsheetStore, setOpenSceneIds, addNewBeat, addNewScene } =
		useBeatsheetStore()

	const { characters, enhancementPlan, scenes, openSceneIds, activeDragItem } =
		beatsheetStore(
			useShallow((state) => ({
				characters: state.characters,
				enhancementPlan: state.enhancementPlan,
				scenes: state.scenes,
				openSceneIds: state.openSceneIds,
				activeDragItem: state.activeDragItem,
			}))
		)

	const { editorText } = useEditorData()

	const {
		isPending,
		mutate: generateBeatsheet,
		generatingSceneIds,
		approveContent,
		rejectContent,
		getPendingContentForScene,
		error,
		clearError,
		timeoutProgress,
	} = useBeatsheetMutation()

	const handleGenerateTask = (scenes: { data: TScene; index: number }[]) => {
		// Clear any previous errors before starting new generation
		clearError()

		generateBeatsheet({
			params: {
				beats: Object.fromEntries(
					scenes.map((scene) => [`scene_${scene.index + 1}`, scene.data.beats])
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
			},
			sceneIds: scenes.map((scene) => scene.data.id),
		})
	}

	const handleApproveContent = (sceneId: string) => {
		const pendingContent = getPendingContentForScene(sceneId)
		if (pendingContent) {
			// Apply the content to the editor
			handleGenerateScenes(
				pendingContent,
				pendingContent.map((scene) => scene.id)
			)
			approveContent(sceneId)
		}
	}

	const handleRejectContent = (sceneId: string) => {
		rejectContent(sceneId)
	}

	// Check if there's a timeout error
	const hasTimeoutError = error?.message?.includes('timed out')

	// Calculate remaining time in seconds
	const getRemainingTime = () => {
		if (timeoutProgress === 0) {
			return null
		}
		const isSingleGeneration = generatingSceneIds.length === 1
		const totalSeconds = isSingleGeneration ? 60 : 180
		const remainingSeconds = Math.ceil((timeoutProgress / 100) * totalSeconds)
		return remainingSeconds
	}

	const remainingTime = getRemainingTime()

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
						{scenes.map((scene, idx) => {
							const isGenerating = generatingSceneIds.includes(scene.id)
							const isAnyGenerating = generatingSceneIds.length > 0
							const pendingContent = getPendingContentForScene(scene.id)
							const isPendingApproval = !!pendingContent

							return (
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
													disabled={isGenerating}
												/>
											</div>
										</AccordionTrigger>
										<SortableContext
											items={scene.beats.map((beat) => beat.id)}
											strategy={verticalListSortingStrategy}
										>
											<AccordionContent className="relative space-y-2">
												{isGenerating && (
													<div className="bg-background/80 absolute inset-0 z-10 flex items-center justify-center rounded-lg backdrop-blur-sm">
														<div className="text-muted-foreground flex flex-col items-center gap-2">
															<CircularLoader
																className="h-4 w-4"
																text="Generating..."
															/>
															{remainingTime && (
																<div className="text-muted-foreground text-xs">
																	Timeout in {remainingTime}s
																</div>
															)}
														</div>
													</div>
												)}
												{isPendingApproval && (
													<div className="bg-background/80 absolute inset-0 z-20 flex flex-col backdrop-blur-sm">
														<div className="flex-1 overflow-y-auto p-4">
															{pendingContent?.map((generatedScene) => (
																<Typography
																	as="span"
																	key={generatedScene.id}
																	className="whitespace-pre-wrap"
																	variant="body-small"
																>
																	{generatedScene.content}
																</Typography>
															))}
														</div>
														<div className="flex justify-between gap-2 p-4">
															<Button
																size="sm"
																variant="outline"
																onClick={() => handleRejectContent(scene.id)}
																className="flex items-center gap-1"
															>
																<X size={16} />
																Reject
															</Button>
															<Button
																size="sm"
																onClick={() => handleApproveContent(scene.id)}
																className="flex items-center gap-1"
																variant="outline"
															>
																<Check size={16} />
																Accept
															</Button>
														</div>
													</div>
												)}
												{scene.beats.map((beat, index) => (
													<SortableBeat
														key={beat.id}
														id={beat.id}
														index={index}
													>
														<TextArea
															value={beat.content || 'No content'}
															onChange={(e) =>
																handleInput(scene.id, beat.id, e.target.value)
															}
															disabled={isGenerating}
														/>
													</SortableBeat>
												))}
												<div className="flex items-center justify-between">
													<Button
														variant="outline"
														size="sm"
														onClick={() => addNewBeat(scene.id)}
														disabled={isGenerating}
													>
														<Plus size={16} className="mr-1" /> Add Beat
													</Button>
													<div className="flex items-center gap-2">
														{hasTimeoutError && isGenerating && (
															<div className="text-destructive text-xs font-medium">
																⚠️ Timed out
															</div>
														)}
														<Button
															disabled={isAnyGenerating}
															onClick={() =>
																handleGenerateTask([
																	{ data: scene, index: idx },
																])
															}
															size={'sm'}
														>
															{isGenerating ? (
																<>
																	<Loader2
																		size={16}
																		className="mr-1 animate-spin"
																	/>
																	Generating...
																	{remainingTime &&
																		generatingSceneIds.length === 1 && (
																			<span className="ml-1 text-xs opacity-75">
																				({remainingTime}s)
																			</span>
																		)}
																</>
															) : (
																'Generate'
															)}
														</Button>
													</div>
												</div>
											</AccordionContent>
										</SortableContext>
									</AccordionItem>
								</SortableScene>
							)
						})}
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
				<Button onClick={addNewScene} disabled={isPending}>
					<Plus size={18} className="mr-1" /> ADD Scene
				</Button>
				<div className="flex items-center gap-2">
					{hasTimeoutError && (
						<div className="text-destructive text-sm font-medium">
							⚠️ Generation timed out - please try again
						</div>
					)}
					<Button
						disabled={isPending}
						onClick={() =>
							handleGenerateTask(
								scenes.map((scene, index) => ({ data: scene, index }))
							)
						}
					>
						{isPending ? (
							<>
								<Loader2 size={18} className="mr-1 animate-spin" />
								Generating All...
								{remainingTime && generatingSceneIds.length > 1 && (
									<span className="ml-1 text-xs opacity-75">
										({remainingTime}s)
									</span>
								)}
							</>
						) : (
							'Generate All'
						)}
					</Button>
				</div>
			</div>
		</>
	)
}
