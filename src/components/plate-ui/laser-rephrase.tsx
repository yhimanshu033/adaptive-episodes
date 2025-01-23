/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React, { useCallback, useEffect } from 'react'
import { rephraseMethods } from '@/constants/editor-constants'
import useLaserToolsHook from '@/hooks/mutation/use-lasertool-hook'
import useEpisodeContent from '@/hooks/query/use-episode-content'
import useLaserStore from '@/store/laser-store'
import { useEditorState } from '@udecode/plate-common/react'
import { X } from 'lucide-react'
import { useShallow } from 'zustand/react/shallow'

import { Button } from '@/components/ui/button'
import Spinner from '@/components/ui/spinner'
import { getText } from '@/lib/utils/plate'

import { RephraseSelectionProps } from '@/types/editor-types'

export default function LaserRephrase({
	getSelectedText,
	methodId,
	elemKey: key,
	onResetLeaf,
	promptInput,
	setResponseMode,
}: RephraseSelectionProps) {
	const { data: episodeContent } = useEpisodeContent()
	const { children } = useEditorState()
	const {
		laserToolsMutation: { data, isPending, reset, mutate },
	} = useLaserToolsHook()

	const {
		store: laserStore,
		getLaser,
		setLaser,
		setResponseActive,
		setTriggerRephrase,
	} = useLaserStore()

	const triggerRephrase = laserStore(
		useShallow((state) => state.triggerRephrase)
	)
	const responseActive = laserStore(useShallow((state) => state.responseActive))

	useEffect(() => {
		setResponseMode(!!data)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data])

	const handleRephrase = useCallback(
		(action: string) => {
			mutate({
				action,
				...getSelectedText(),
				context: episodeContent?.chapter.props?.llm_memories?.context || '',
				ep_number: episodeContent?.chapter.seq_number.toString() || '',
				ep_text: getText(children) || '',
				prompt: promptInput,
				style_template: '',
			})
		},
		[
			mutate,
			getSelectedText,
			episodeContent?.chapter.props?.llm_memories?.context,
			episodeContent?.chapter.seq_number,
			children,
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
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data, isPending, getSelectedText, key])

	useEffect(() => {
		handleRephrase(methodId)
	}, [methodId, handleRephrase])

	useEffect(() => {
		if (triggerRephrase === key) {
			reset()
			handleRephrase(methodId)
			setTriggerRephrase(null)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [triggerRephrase, key, reset])

	return (
		<>
			{data || responseActive === key ? (
				<></>
			) : (
				<div className="flex items-center gap-1 p-2">
					<Button variant="ghost" size="sm" onClick={onResetLeaf}>
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
