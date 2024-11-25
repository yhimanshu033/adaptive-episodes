import React, { useCallback, useEffect, useState } from 'react'
import { rephraseMethods } from '@/constants/editor-constants'
import useLaserToolsHook from '@/hooks/mutation/use-lasertool-hook'
import useEpisodeContent from '@/hooks/query/use-episode-content'
import { setActiveLaser } from '@/store/laser-store'
import usePlateStore from '@/store/plate-store'
import { RotateCw, X } from 'lucide-react'

import DiffView from '@/lib/plate/plugins/diff'
import { cn } from '@/lib/utils'

import { RephraseSelectionProps } from '@/types/editor-types'

import { Button } from '../ui/button'
import Spinner from '../ui/spinner'

type LaserRephraseProps = RephraseSelectionProps & {
	methodId: string
	onResetLeaf: () => void
	promptInput: string
}

export default function LaserRephrase({
	getSelectedText,
	methodId,
	onResponse,
	elemKey: key,
	onRephrase,
	previous,
	current,
	onResetLeaf,
	promptInput,
}: LaserRephraseProps) {
	const [textInput, setTextInput] = useState('')
	const { data: episodeContent } = useEpisodeContent()
	const {
		laserToolsMutation: { data, isPending, reset, mutate },
	} = useLaserToolsHook()
	const { isTranslationOpen, sidebar } = usePlateStore()
	const minify = sidebar || isTranslationOpen

	const handleAcceptRephrase = () => {
		onRephrase(textInput)
	}

	const handleRejectRephrase = () => {
		reset()
		onResetLeaf()
	}

	const handleRephrase = useCallback(
		(action: string) => {
			mutate({
				action,
				...getSelectedText(),
				context: episodeContent?.chapter.props.llm_memories?.context || '',
				ep_number: episodeContent?.chapter.seq_number.toString() || '',
				ep_text: episodeContent?.text || '',
				prompt: promptInput,
				style_template: '',
			})
		},
		[
			mutate,
			getSelectedText,
			episodeContent?.chapter.props.llm_memories?.context,
			episodeContent?.chapter.seq_number,
			episodeContent?.text,
			promptInput,
		]
	)

	useEffect(() => {
		if (data && !isPending) {
			setTextInput(data.result)
			onResponse(data.result)
		}
	}, [data, isPending, setTextInput, onResponse])

	useEffect(() => {
		handleRephrase(methodId)
	}, [methodId, handleRephrase])

	return (
		<>
			{data ? (
				<div
					id={`leaf-response-${key}`}
					onClick={(e) => {
						e.stopPropagation()
						e.preventDefault()
					}}
					className={cn(
						'relative w-full',
						minify ? 'min-w-[35vw]' : 'min-w-[70vw]'
					)}
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
						<Button variant="ghost" onClick={() => handleRephrase(methodId)}>
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
				<div className="flex items-center gap-2 p-4">
					<Button size="sm" onClick={onResetLeaf}>
						<X />
					</Button>
					<h4>
						{rephraseMethods.find((m) => m.id === methodId)?.method} working...
					</h4>
					<Spinner size={24} />
				</div>
			)}
		</>
	)
}
