'use client'

import React from 'react'
import { Check, Loader2, Plus, X } from 'lucide-react'

import { Button } from '@/components/aural-ui/button'
import CircularLoader from '@/components/aural-ui/circular-loader'
import { Else, If, IfElse } from '@/components/aural-ui/if-else'
import { ScrollArea } from '@/components/aural-ui/scroll-area'
import TextArea from '@/components/aural-ui/textarea'
import { Typography } from '@/components/aural-ui/typography'
import ScenePromptInline from '@/components/beatsheet-editor/scene-prompt-inline'

import {
	TGenerateBeatsheetResponseItem,
	TScene,
} from '@/types/beatsheet-editor-types'

import GenerationStatusBar from './generation-status-bar'
import SortableBeat from './sortable-beat'

export type SceneContentProps = SceneGenerationProps &
	ScenePendingProps & {
		isPendingApproval: boolean
		onGenerate: (prompt?: string) => void
		onInput: (beatId: string, data: string) => void
		onNewBeat: () => void
		onPromptClose: () => void
		openPromptId: string | null
		scene: TScene
	}

interface SceneGenerationProps {
	hasTimeoutError: boolean
	isGenerating: boolean
	logs: string[]
	remainingTime: number
}

interface ScenePendingProps {
	onAccept: () => void
	onReject: () => void
	pendingContent: TGenerateBeatsheetResponseItem
}

const SceneGeneration = ({
	isGenerating,
	logs,
	hasTimeoutError,
	remainingTime,
}: SceneGenerationProps) => {
	return (
		<div className="h-[600px]">
			<GenerationStatusBar
				isPending={isGenerating}
				hasTimeoutError={hasTimeoutError}
				remainingTime={remainingTime}
			/>

			<IfElse condition={!!logs?.length}>
				<If>
					<ScrollArea className="text-fm-secondary h-full">
						{logs.map((log, idx) => (
							<p className="text-xs" key={`bse-log-${idx}`}>
								{log}
							</p>
						))}
					</ScrollArea>
				</If>
				<Else>
					<div className="text-muted-foreground flex flex-col gap-2">
						<CircularLoader className="h-4 w-4" text="Generating..." />
					</div>
				</Else>
			</IfElse>
		</div>
	)
}

const ScenePending = ({
	onAccept,
	onReject,
	pendingContent,
}: ScenePendingProps) => {
	return (
		<div className="flex flex-col">
			<div className="flex-1 overflow-y-auto p-4">
				<Typography
					as="span"
					key={pendingContent?.id}
					className="whitespace-pre-wrap"
					variant="body-small"
				>
					{pendingContent?.content}
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
	)
}
export default function SceneContent({
	isGenerating,
	scene,
	hasTimeoutError,
	isPendingApproval,
	logs,
	onGenerate,
	onInput,
	onNewBeat,
	onPromptClose,
	openPromptId,
	pendingContent,
	remainingTime,
	onAccept,
	onReject,
}: SceneContentProps) {
	if (isGenerating) {
		return (
			<SceneGeneration
				hasTimeoutError={hasTimeoutError}
				isGenerating={isGenerating}
				logs={logs}
				remainingTime={remainingTime}
			/>
		)
	}

	if (isPendingApproval && pendingContent) {
		return (
			<ScenePending
				onAccept={onAccept}
				onReject={onReject}
				pendingContent={pendingContent}
			/>
		)
	}
	return (
		<>
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
		</>
	)
}
