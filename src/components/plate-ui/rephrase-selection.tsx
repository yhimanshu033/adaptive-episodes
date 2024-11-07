import React, { useCallback, useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { rephraseMethods } from '@/constants/editor-constants'
import useLaserToolsHook from '@/hooks/mutation/use-lasertool-hook'
import useEpisodeContent from '@/hooks/query/use-episode-content'
import useLaserStore, {
	setActiveLaser,
	setPromptActive,
} from '@/store/laser-store'
import usePlateStore from '@/store/plate-store'
import { ArrowLeft, RotateCw, Send, X } from 'lucide-react'

import Spinner from '@/components/ui/spinner'
import DiffView, { DiffViewProps } from '@/lib/plate/plugins/diff'

import { Button } from './button'

interface RephraseSelectionProps extends DiffViewProps {
	elemKey: string | null
	getSelectedText: () => {
		nexttext: string
		prevtext: string
		text: string
	}
	onRephrase: (text: string) => void
	onResponse: (text: string) => void
	reset: () => void
}
const RephraseSelection = React.memo(
	({
		onResponse,
		onRephrase,
		getSelectedText,
		reset: resetRephrase,
		current,
		previous,
		elemKey: key,
	}: RephraseSelectionProps) => {
		// const { onRephrase, getSelectedText } = useRephrase()
		// const { resetActiveComments } = useComments()
		const [textInput, setTextInput] = useState('')
		const [showPrompt, setShowPrompt] = useState(false)
		const { episodeId } = useParams()
		const { data: episodeContent } = useEpisodeContent()

		const { isTranslationOpen, sidebar } = usePlateStore()
		const minify = sidebar || isTranslationOpen
		// const id = useFloatingNodeId()

		const [currentMethod, setMethod] = useState('')

		const { laserToolsMutation } = useLaserToolsHook()
		const { data, isPending, reset } = laserToolsMutation

		const { lasers } = useLaserStore()

		const laser = lasers[key!] ?? { prompt: '' }

		const { prompt: promptInput } = laser
		const handleRephrase = (action: string) => {
			setMethod(action)
			laserToolsMutation.mutate({
				action,
				...getSelectedText(),
				context: episodeContent?.context || '',
				ep_number: episodeId as string,
				ep_text: episodeContent?.de || '',
				prompt: promptInput,
				style_template: '',
			})
		}

		const handleAcceptRephrase = () => {
			onRephrase(textInput)
		}

		const handleRejectRephrase = () => {
			reset()
		}

		const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
			e.preventDefault()
			setShowPrompt(false)
			handleRephrase('custom')
		}

		useEffect(() => {
			if (data && !isPending) {
				setTextInput(data.result)
				onResponse(data.result)
			}
		}, [data, isPending, setTextInput])

		const handleSetPrompt = useCallback(() => {
			setPromptActive(key)
			setShowPrompt(true)
			document.getElementById('prompt-input')?.focus()
		}, [key])

		return (
			<>
				{data ? (
					<div
						className={`relative w-full ${minify ? 'min-w-[35vw]' : 'min-w-[70vw]'} `}
					>
						<Button
							onClick={() => {
								setActiveLaser(null)
							}}
							className="absolute right-2 top-2 z-10 !h-auto !p-2 opacity-65"
						>
							<X size={10} />
						</Button>
						<DiffView previous={previous} current={current} />
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
				) : showPrompt ? (
					<div className="relative py-2">
						<form
							className="flex min-w-96 flex-1 items-end space-x-2 rounded-md border bg-background"
							onSubmit={handleSubmit}
						>
							<Button
								variant="ghost"
								size="sm"
								type="button"
								onClick={() => {
									setShowPrompt(false)
									setPromptActive(null)
								}}
							>
								<ArrowLeft size={16} />
							</Button>
							{/* <Input
							placeholder="Enter prompt..."
							// value={promptInput}
							// onChange={(e) => setPromptInput(e.target.value)}
							className="min-h-[40px] grow resize-none overflow-y-auto border-none bg-transparent px-3 py-2 leading-relaxed outline-none focus-visible:border-none focus-visible:ring-0 focus-visible:ring-offset-0"
						/> */}
							<div className="relative overflow-hidden rounded-lg px-4 py-2 font-mono text-sm ring-1 ring-accent-foreground">
								{laser.caretPos && (
									<span
										style={{
											position: 'absolute',
											left: `calc(1rem + ${laser.caretPos % (minify ? 50 : 250) || 0}ch)`, // Approximate width of each character
											top: '50%',
											transform: 'translateY(-50%)',
											width: '1px',
											height: '1.2em',
											backgroundColor: 'white',
											animation: 'blink 1s steps(2, start) infinite',
										}}
									/>
								)}
								{/* {laser.caretPos && laser.caretEnd && <span
									style={{
										position: 'absolute',
										left: `calc(1rem + ${Math.min(laser.caretPos, laser.caretEnd) || 0}ch)`, // Approximate width of each character
										top: '50%',
										transform: 'translateY(-50%)',
										width: `${Math.abs(laser.caretPos - laser.caretEnd)}ch`,
										height: '1.2em',
										backgroundColor: 'rbga(255, 0, 0, 0.2)',
										// animation: 'blink 1s steps(2, start) infinite',
									}}
								/>} */}
								<input
									onFocus={() => {
										document.getElementById('prompt-input')?.focus()
									}}
									value={promptInput}
									readOnly
									className={` ${minify ? 'w-[50ch]' : 'w-[250ch]'}`}
								/>
							</div>
							<Button variant="ghost" size="icon" type="submit">
								<Send size={16} />
							</Button>
						</form>
					</div>
				) : (
					<div className="flex items-center">
						<Button
							variant="ghost"
							size="sm"
							onClick={() => {
								resetRephrase()
							}}
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
										? handleSetPrompt()
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
					</div>
				)}
			</>
		)
	}
)

RephraseSelection.displayName = 'RephraseSelection'
export default RephraseSelection
