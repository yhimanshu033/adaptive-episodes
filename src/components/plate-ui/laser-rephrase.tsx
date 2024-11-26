import React, { useCallback, useEffect } from 'react'
import { rephraseMethods } from '@/constants/editor-constants'
import useLaserToolsHook from '@/hooks/mutation/use-lasertool-hook'
import useEpisodeContent from '@/hooks/query/use-episode-content'
import useLaserStore, {
	getLaser,
	setLaser,
	setResponseActive,
	setTriggerRephrase,
} from '@/store/laser-store'
import { X } from 'lucide-react'
import { useShallow } from 'zustand/react/shallow'

import { RephraseSelectionProps } from '@/types/editor-types'

import { Button } from '../ui/button'
import Spinner from '../ui/spinner'

export default function LaserRephrase({
	getSelectedText,
	methodId,
	elemKey: key,
	onResetLeaf,
	promptInput,
	setResponseMode,
}: RephraseSelectionProps) {
	const { data: episodeContent } = useEpisodeContent()
	const {
		laserToolsMutation: { data, isPending, reset, mutate },
	} = useLaserToolsHook()

	const triggerRephrase = useLaserStore(
		useShallow((state) => state.triggerRephrase)
	)
	const responseActive = useLaserStore(
		useShallow((state) => state.responseActive)
	)

	useEffect(() => {
		setResponseMode(!!data)
	}, [data, setResponseMode])

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
			if (!key) return
			setResponseActive(key)
			const laser = getLaser(key)
			setLaser({
				id: key,
				laser: {
					...laser,
					response: data.result,
					text: getSelectedText().text,
				},
			})
		}
	}, [data, isPending, getSelectedText, key])

	useEffect(() => {
		handleRephrase(methodId)
	}, [methodId, handleRephrase])

	useEffect(() => {
		if (triggerRephrase === key) {
			reset()
			setTriggerRephrase(null)
		}
	}, [triggerRephrase, key, reset])

	return (
		<>
			{data || responseActive === key ? (
				<></>
			) : (
				<div className="flex items-center gap-1 p-2">
					<Button size="sm" onClick={onResetLeaf}>
						<X size={16} />
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
