import React, { useCallback, useEffect, useState } from 'react'
import { rephraseMethods, tools } from '@/constants/editor-constants'
import useEditorStore, {
	handleToolStates,
	setTooltipPosition,
	toggleTooltip,
} from '@/store/editor-store'
import { Bot } from 'lucide-react'

import { Button } from '@/components/ui/button'

const Tooltip = ({
	editorRef,
}: {
	editorRef: React.RefObject<HTMLDivElement>
}) => {
	const [showRephrase, setShowRephrase] = useState(false)
	const { showTooltip, tooltipPosition, toolsState } = useEditorStore()

	const handleFormat = (command: string) => {
		document.execCommand(command, false)
		handleToolStates()
	}

	const handleRephrase = useCallback((toggle: boolean) => {
		setShowRephrase(toggle)
	}, [])

	const handleSelectionChange = useCallback(() => {
		const selection = window.getSelection()
		if (selection && !selection.isCollapsed && editorRef.current) {
			const range = selection.getRangeAt(0)
			const rect = range.getBoundingClientRect()
			const editorRect = editorRef.current.getBoundingClientRect()

			setTooltipPosition({
				top: rect.bottom - editorRect.top + 10,
				left: rect.left - editorRect.left,
			})
			toggleTooltip(true)
		} else {
			toggleTooltip(false)
			handleRephrase(false)
		}
	}, [editorRef, handleRephrase])

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
					className="absolute flex space-x-1 rounded-md border bg-background p-1 shadow-lg"
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
								onClick={() => handleRephrase(true)}
							>
								<Bot className="size-3" />
							</Button>
						</>
					) : (
						rephraseMethods.map((method) => (
							<Button
								key={method}
								variant="ghost"
								onClick={() => handleRephrase(false)}
							>
								{method}
							</Button>
						))
					)}
				</div>
			)}
		</div>
	)
}

export default Tooltip
