import React, { useCallback, useEffect, useState } from 'react'
import { rephraseMethods, tools } from '@/constants/editor-constants'
import useLaserToolsHook from '@/hooks/mutation/use-lasertool-hook'
import useEpisodeContent from '@/hooks/query/use-episode-content'
import useEditorStore, {
	handleToolStates,
	setTooltipPosition,
	toggleTooltip,
} from '@/store/editor-store'
import { Bot } from 'lucide-react'

import { Button } from '@/components/ui/button'
import Spinner from '@/components/ui/spinner'

const Tooltip = ({
	editorRef,
}: {
	editorRef: React.RefObject<HTMLDivElement>
}) => {
	const [showRephrase, setShowRephrase] = useState(false)
	const [currentMethod, setMethod] = useState('')
	const [textState, setTextState] = useState({
		text: '',
		prevtext: '',
		nexttext: '',
	})
	const { showTooltip, tooltipPosition, toolsState } = useEditorStore()
	const { data: content } = useEpisodeContent()

	const { laserToolsMutation } = useLaserToolsHook()
	const { data, isPending, reset } = laserToolsMutation

	const handleFormat = (command: string) => {
		document.execCommand(command, false)
		handleToolStates()
	}

	const toggleRephrase = useCallback((toggle: boolean) => {
		setShowRephrase(toggle)
	}, [])

	const handleRephrase = (action: string) => {
		setMethod(action)
		laserToolsMutation.mutate({
			action,
			...textState,
			context: content?.summary,
		})
	}

	const handleAcceptRephrase = (rephrasedText: string) => {
		const selection = window.getSelection()
		if (selection && !selection.isCollapsed) {
			const range = selection.getRangeAt(0)
			range.deleteContents()
			range.insertNode(document.createTextNode(rephrasedText))
			toggleTooltip(false)
			reset()
		}
	}

	const handleRejectRephrase = () => {
		toggleTooltip(false)
		reset()
	}

	const handleSelectionChange = useCallback(() => {
		const selection = window.getSelection()
		if (selection && !selection.isCollapsed && editorRef.current) {
			const range = selection.getRangeAt(0)
			const rect = range.getBoundingClientRect()
			const editorRect = editorRef.current.getBoundingClientRect()

			const editorText = editorRef.current.textContent || ''
			const selectionStart =
				editorText.indexOf(range.startContainer.textContent ?? '') +
				range.startOffset
			const selectionEnd =
				editorText.indexOf(range.endContainer.textContent ?? '') +
				range.endOffset

			const prevText =
				editorText.slice(Math.max(0, selectionStart - 400), selectionStart) ||
				''
			const nextText =
				editorText.slice(
					selectionEnd,
					Math.min(selectionEnd + 400, editorText.length)
				) || ''

			setTooltipPosition({
				top: rect.bottom - editorRect.top + 10,
				left: rect.left - editorRect.left,
			})
			toggleTooltip(true)
			setTextState({
				text: selection.toString(),
				prevtext: prevText,
				nexttext: nextText,
			})
		} else {
			reset()
			toggleTooltip(false)
			toggleRephrase(false)
		}
	}, [editorRef, reset, toggleRephrase])
	useEffect(() => {
		document.addEventListener('selectionchange', handleSelectionChange)
		return () => {
			document.removeEventListener('selectionchange', handleSelectionChange)
		}
	}, [handleSelectionChange])

	return (
		<div>
			{showTooltip && (
				<div
					className="absolute flex flex-wrap space-x-1 rounded-md border bg-background p-1 shadow-lg"
					style={{
						top: `${tooltipPosition.top}px`,
						left: `${tooltipPosition.left}px`,
					}}
				>
					{!showRephrase ? (
						<>
							{tools.slice(0, 3).map(({ icon: Icon, type }) => (
								<Button
									key={type}
									variant={toolsState[type] ? 'default' : 'ghost'}
									size="icon"
									onClick={() => handleFormat(type)}
								>
									<Icon className="size-3" />
								</Button>
							))}
							<Button
								variant="ghost"
								size="icon"
								onClick={() => toggleRephrase(true)}
							>
								<Bot className="size-3" />
							</Button>
						</>
					) : !data ? (
						rephraseMethods.map((method) => (
							<Button
								key={method.id}
								variant="ghost"
								onClick={() => handleRephrase(method.id)}
							>
								{isPending && currentMethod === method.id ? (
									<Spinner size={16} />
								) : (
									method.method
								)}
							</Button>
						))
					) : (
						<div className="z-20 min-w-56 rounded-md p-4 shadow-md">
							<div className="mb-2 text-muted-foreground">{textState.text}</div>
							<div className="mb-4 text-accent-foreground">{data.result}</div>
							<div className="flex items-center justify-end gap-2">
								<Button
									variant="outline"
									size="sm"
									className="mr-2"
									onClick={handleRejectRephrase}
								>
									Reject
								</Button>
								<Button
									size="sm"
									onClick={() => handleAcceptRephrase(data.result)}
								>
									Accept
								</Button>
							</div>
						</div>
					)}
				</div>
			)}
		</div>
	)
}

export default Tooltip
