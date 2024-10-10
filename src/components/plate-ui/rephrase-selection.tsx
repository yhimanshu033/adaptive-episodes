import React, { useCallback, useState } from 'react'
import { rephraseMethods } from '@/constants/editor-constants'
import useLaserToolsHook from '@/hooks/mutation/use-lasertool-hook'
import useRephrase from '@/hooks/plate/use-rephrase'
import { Bot } from 'lucide-react'

import Spinner from '../ui/spinner'
import { Button } from './button'
import { ToolbarButton } from './toolbar'

export default function RephraseSelection() {
	const { onRephrase, getContent, getSelectedText } = useRephrase()

	const [showRephrase, setShowRephrase] = useState(false)
	const [currentMethod, setMethod] = useState('')
	const [textState] = useState({
		text: '',
		prevtext: '',
		nexttext: '',
	})

	const { laserToolsMutation } = useLaserToolsHook()
	const { data, isPending, reset } = laserToolsMutation
	const toggleRephrase = useCallback((toggle: boolean) => {
		setShowRephrase(toggle)
	}, [])

	const handleRephrase = (action: string) => {
		setMethod(action)
		const content = getContent()
		laserToolsMutation.mutate({
			action,
			...textState,
			text: getSelectedText(),
			context: content,
		})
	}

	const handleAcceptRephrase = (rephrasedText: string) => {
		onRephrase(rephrasedText)
	}

	const handleRejectRephrase = () => {
		reset()
	}

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
						<Button size="sm" onClick={() => handleAcceptRephrase(data.result)}>
							Accept
						</Button>
					</div>
				</div>
			)}
		</div>
	)
}
