import React, {
	Dispatch,
	SetStateAction,
	useCallback,
	useEffect,
	useState,
} from 'react'
import { useParams } from 'next/navigation'
import { rephraseMethods } from '@/constants/editor-constants'
import useLaserToolsHook from '@/hooks/mutation/use-lasertool-hook'
import useComments from '@/hooks/plate/use-comments'
import useRephrase from '@/hooks/plate/use-rephrase'
import useEpisodeContent from '@/hooks/query/use-episode-content'
import { useFloatingNodeId } from '@udecode/plate-floating'
import { ArrowLeft, Bot, Delete, RotateCw, SendHorizonal } from 'lucide-react'

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'

import Spinner from '../ui/spinner'
import { Textarea } from '../ui/textarea'
import { Button } from './button'
import { ToolbarButton } from './toolbar'

interface RephraseSelectionProps {
	setShowRephrase: Dispatch<SetStateAction<boolean>>
	showRephrase: boolean
}

function PromptDialog({
	dialogOpen,
	setDialogOpen,
	handleRephrase,
	promptInput,
	setPromptInput,
	isPending,
	reset,
}: {
	dialogOpen: boolean
	handleRephrase: (action: string) => void
	isPending: boolean
	promptInput: string
	reset: () => void
	setDialogOpen: Dispatch<SetStateAction<boolean>>
	setPromptInput: Dispatch<SetStateAction<string>>
}) {
	return (
		<Dialog
			open={dialogOpen}
			onOpenChange={(o) => {
				setDialogOpen(o)
				reset()
			}}
		>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>💬 Prompt</DialogTitle>
				</DialogHeader>
				<Textarea
					placeholder="Enter you prompt here..."
					value={promptInput}
					onMouseDown={(e) => e.stopPropagation()}
					onChange={(e) => setPromptInput(e.target.value)}
				/>
				<div className="mt-3 flex justify-between">
					<Button
						size="icon"
						variant="ghost"
						onClick={() => setPromptInput('')}
					>
						<Delete size={16} />
					</Button>
					<Button
						size="icon"
						onClick={() => {
							handleRephrase('custom')
						}}
					>
						{isPending ? <Spinner size={16} /> : <SendHorizonal size={16} />}
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	)
}

function ResultDialog({
	dialogOpen,
	currentMethod,
	handleRephrase,
	handleAcceptRephrase,
	handleRejectRephrase,
	selectedText,
	setTextInput,
	textInput,
	isPending,
}: {
	currentMethod: string
	dialogOpen: boolean
	handleAcceptRephrase: () => void
	handleRejectRephrase: () => void
	handleRephrase: (action: string) => void
	isPending: boolean
	selectedText: string
	setTextInput: Dispatch<SetStateAction<string>>
	textInput: string
}) {
	const method = rephraseMethods.find((m) => m.id === currentMethod)
	return (
		<Dialog
			open={dialogOpen}
			onOpenChange={() => {
				handleRejectRephrase()
			}}
		>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{method?.method || 'Result'}</DialogTitle>
				</DialogHeader>
				<DialogDescription className="truncate">
					{selectedText}
				</DialogDescription>
				{isPending ? (
					<div className="flex w-full justify-center">
						<Spinner size={32} />
					</div>
				) : (
					<>
						<Textarea
							className="mb-4 min-w-[300px] text-accent-foreground"
							value={textInput}
							onChange={(e) => setTextInput(e.target.value)}
						/>
						<div className="flex items-center justify-between">
							<Button
								variant="ghost"
								onClick={() => handleRephrase(currentMethod)}
							>
								<RotateCw size={16} />
							</Button>
							<div className="flex items-center justify-end gap-2">
								<Button
									variant="outline"
									size="sm"
									className="mr-2"
									onClick={handleRejectRephrase}
								>
									Reject
								</Button>
								<Button size="sm" onClick={handleAcceptRephrase}>
									Accept
								</Button>
							</div>
						</div>
					</>
				)}
			</DialogContent>
		</Dialog>
	)
}

export default function RephraseSelection({
	setShowRephrase,
	showRephrase,
}: RephraseSelectionProps) {
	const { onRephrase, getContent, getSelectedText, editor } = useRephrase()
	const { resetActiveComments } = useComments()
	const [textInput, setTextInput] = useState('')
	const [showPrompt, setShowPrompt] = useState(false)
	const [promptInput, setPromptInput] = useState('')
	const { episodeId } = useParams()
	const { data: episodeContent } = useEpisodeContent()

	const id = useFloatingNodeId()

	function resetFloatingToolbar() {
		editor.setSelection({
			anchor: { offset: 0, path: [0, 0] },
			focus: { offset: 0, path: [0, 0] },
		})
	}
	useEffect(() => {
		resetActiveComments()
	}, [id, resetActiveComments])

	const [currentMethod, setMethod] = useState('')

	const { laserToolsMutation } = useLaserToolsHook()
	const { data, isPending, reset } = laserToolsMutation
	const toggleRephrase = useCallback(
		(toggle: boolean) => {
			setShowRephrase(toggle)
		},
		[setShowRephrase]
	)

	const handleRephrase = (action: string) => {
		setMethod(action)
		const content = getContent()
		laserToolsMutation.mutate({
			action,
			...getSelectedText(),
			context: content,
			ep_number: episodeId as string,
			ep_text: episodeContent?.de || '',
			prompt: promptInput,
		})
	}

	const handleAcceptRephrase = () => {
		onRephrase(textInput)
		resetActiveComments()
	}

	const handleRejectRephrase = () => {
		resetFloatingToolbar()
		reset()
	}

	useEffect(() => {
		if (data && !isPending) setTextInput(data.result)
	}, [data, isPending, setTextInput])

	return (
		<div>
			{!showRephrase ? (
				<>
					<ToolbarButton
						onClick={() => toggleRephrase(true)}
						tooltip="Rephrase"
					>
						<Bot />
					</ToolbarButton>
				</>
			) : (
				<div className="flex items-center">
					<Button
						variant="ghost"
						size="sm"
						onClick={() => toggleRephrase(false)}
					>
						<ArrowLeft size={16} />
					</Button>
					{rephraseMethods.map((method) => (
						<Button
							key={method.id}
							variant="ghost"
							className="my-1"
							onClick={() =>
								method.id === 'custom'
									? setShowPrompt(true)
									: handleRephrase(method.id)
							}
						>
							{isPending && currentMethod === method.id ? (
								<Spinner size={16} />
							) : (
								method.method
							)}
						</Button>
					))}
					<PromptDialog
						reset={resetFloatingToolbar}
						isPending={isPending}
						dialogOpen={showPrompt && !data}
						handleRephrase={handleRephrase}
						promptInput={promptInput}
						setDialogOpen={setShowPrompt}
						setPromptInput={setPromptInput}
					/>
					<ResultDialog
						isPending={isPending}
						currentMethod={currentMethod}
						dialogOpen={currentMethod === 'custom' ? !!data : !!currentMethod}
						handleAcceptRephrase={handleAcceptRephrase}
						handleRejectRephrase={handleRejectRephrase}
						handleRephrase={handleRephrase}
						selectedText={getSelectedText().text}
						setTextInput={setTextInput}
						textInput={textInput}
					/>
				</div>
			)}
		</div>
	)
}
