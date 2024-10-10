import React, {
	Dispatch,
	SetStateAction,
	useCallback,
	useEffect,
	useState,
} from 'react'
import { rephraseMethods } from '@/constants/editor-constants'
import useLaserToolsHook from '@/hooks/mutation/use-lasertool-hook'
import useComments from '@/hooks/plate/use-comments'
import useRephrase from '@/hooks/plate/use-rephrase'
import { useFloatingNodeId } from '@udecode/plate-floating'
import { ArrowLeft, Bot, RotateCw } from 'lucide-react'

import Spinner from '../ui/spinner'
import { Textarea } from '../ui/textarea'
import { Button } from './button'
import { ToolbarButton } from './toolbar'

interface RephraseSelectionProps {
	setShowRephrase: Dispatch<SetStateAction<boolean>>
	showRephrase: boolean
}
export default function RephraseSelection({
	setShowRephrase,
	showRephrase,
}: RephraseSelectionProps) {
	const { onRephrase, getContent, getSelectedText } = useRephrase()
	const { resetActiveComments } = useComments()
	const [textInput, setTextInput] = useState('')

	const id = useFloatingNodeId()

	useEffect(() => {
		resetActiveComments()
	}, [id, resetActiveComments])

	const [currentMethod, setMethod] = useState('')
	const [textState] = useState({
		text: '',
		prevtext: '',
		nexttext: '',
	})

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
			...textState,
			text: getSelectedText(),
			context: content,
		})
	}

	const handleAcceptRephrase = () => {
		onRephrase(textInput)
		resetActiveComments()
	}

	const handleRejectRephrase = () => {
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
			) : !data ? (
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
							onClick={() => handleRephrase(method.id)}
						>
							{isPending && currentMethod === method.id ? (
								<Spinner size={16} />
							) : (
								method.method
							)}
						</Button>
					))}
				</div>
			) : (
				<div className="z-20 min-w-56 rounded-md p-4 shadow-md">
					<div className="mb-2 text-muted-foreground">{getSelectedText()}</div>
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
				</div>
			)}
		</div>
	)
}
