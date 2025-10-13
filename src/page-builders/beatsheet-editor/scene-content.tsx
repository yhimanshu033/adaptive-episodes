'use client'

import React from 'react'
import { SparklesSoftIcon } from '@/icons/sparkles-soft-icon'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { Check, Loader2, Plus, Trash2, X } from 'lucide-react'

import { Button } from '@/components/aural-ui/button'
import { IconButton } from '@/components/aural-ui/icon-button'
import { If } from '@/components/aural-ui/if-else'
import TextArea from '@/components/aural-ui/textarea'
import { Typography } from '@/components/aural-ui/typography'
import ScenePromptInline from '@/components/beatsheet-editor/scene-prompt-inline'
import {
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion'

import {
	TGenerateBeatsheetResponseItem,
	TScene,
} from '@/types/beatsheet-editor-types'

import GenerationStatusBar from './generation-status-bar'
import SortableBeat from './sortable-beat'
import { SortableScene } from './sortable-scene'

interface SceneContentProps {
	hasTimeoutError: boolean
	idx: number
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
export default function SceneContent({
	idx,
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
									isDisabled={isGenerating}
								>
									<Plus size={16} className="mr-1" /> Add Beat
								</Button>
							</div>
							<Button
								onClick={() => onGenerate()}
								disabled={isGenerating}
								isDisabled={isGenerating}
								size="sm"
							>
								<If condition={isGenerating}>
									<Loader2 size={16} className="mr-1 animate-spin" />
								</If>
								Generate
							</Button>
						</div>
					</AccordionContent>
				</SortableContext>
			</AccordionItem>
		</SortableScene>
	)
}
