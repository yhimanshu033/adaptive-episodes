import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useParams } from 'next/navigation'
import { rephraseMethods } from '@/constants/editor-constants'
import useLaserToolsHook from '@/hooks/mutation/use-lasertool-hook'
import useEpisodeContent from '@/hooks/query/use-episode-content'
import useLaserStore, {
	setActiveLaser,
	setPromptActive,
	setTriggerRephrase,
} from '@/store/laser-store'
import usePlateStore from '@/store/plate-store'
import { ArrowLeft, RotateCw, X } from 'lucide-react'

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
		const [textInput, setTextInput] = useState('')
		const { episodeId } = useParams()
		const { data: episodeContent } = useEpisodeContent()

		const { isTranslationOpen, sidebar } = usePlateStore()
		const minify = sidebar || isTranslationOpen

		const [currentMethod, setMethod] = useState('')

		const { laserToolsMutation } = useLaserToolsHook()
		const { data, isPending, reset } = laserToolsMutation

		const { lasers, promptActive, active, triggerRephrase } = useLaserStore()

		const laser = useMemo(() => lasers[key!] ?? { prompt: '' }, [lasers, key])

		const showPrompt = promptActive === key && active === key

		const { prompt: promptInput } = laser
		const handleRephrase = useCallback(
			(action: string) => {
				setMethod(action)
				laserToolsMutation.mutate({
					action,
					...getSelectedText(),
					context: episodeContent?.chapter.context || '',
					ep_number: episodeId as string,
					ep_text: episodeContent?.text || '',
					prompt: promptInput,
					style_template: '',
				})
			},
			[
				laserToolsMutation,
				getSelectedText,
				episodeContent,
				episodeId,
				promptInput,
			]
		)

		const handleAcceptRephrase = () => {
			onRephrase(textInput)
		}

		const handleRejectRephrase = () => {
			reset()
		}

		useEffect(() => {
			if (data && !isPending) {
				setTextInput(data.result)
				onResponse(data.result)
			}
		}, [data, isPending, setTextInput, onResponse])

		useEffect(() => {
			if (!laser.prompt.trim() || !key) return
			if (triggerRephrase === key) {
				setPromptActive(null)
				handleRephrase('custom')
				setTriggerRephrase(null)
			}
		}, [triggerRephrase, key, laser, handleRephrase])

		const handleSetPrompt = useCallback(() => {
			setPromptActive(key)
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
				) : (
					!showPrompt && (
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
					)
				)}
			</>
		)
	}
)

RephraseSelection.displayName = 'RephraseSelection'
export default RephraseSelection
