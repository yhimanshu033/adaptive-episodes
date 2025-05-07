import React, { useEffect } from 'react'
import { rephraseMethods } from '@/constants/editor-constants'
import { languageToTitle } from '@/constants/episodes-constants'
import useEpisodeContent from '@/hooks/query/use-episode-content'
import useLaserToolsQuery from '@/hooks/query/use-lasertool-data'
import useLanguage from '@/hooks/use-language'
import useLaserStore from '@/store/laser-store'
import { useEditorState } from '@udecode/plate-common/react'
import { X } from 'lucide-react'
import { useShallow } from 'zustand/react/shallow'

import { Button } from '@/components/ui/button'
import Spinner from '@/components/ui/spinner'
import { getText } from '@/lib/utils/plate'

import { LaserToolsParams } from '@/types/ai-types'
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
	const lasersResponseMap = laserStore(useShallow((state) => state.lasers))

	const language = useLanguage()
	const params: LaserToolsParams = {
		action: methodId,
		...getSelectedText(),
		context: episodeContent?.chapter.props?.llm_memories?.context || '',
		ep_number: episodeContent?.chapter.seq_number.toString() || '',
		ep_text: getText(children) || '',
		prompt: promptInput,
		style_template: '',
		input_language: languageToTitle[language],
	}

	if (key && triggerRephrase === key && lasersResponseMap[key]?.response) {
		params.last_answer = lasersResponseMap[key].response
	}

	const { data, isFetching, refetch } = useLaserToolsQuery(key, params)

	useEffect(() => {
		setResponseMode(!!data)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data])

	useEffect(() => {
		if (data && !isFetching) {
			if (!key) {
				return
			}
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
	}, [data, isFetching, getSelectedText, key])

	useEffect(() => {
		if (triggerRephrase === key) {
			void refetch()
			setTriggerRephrase(null)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [triggerRephrase, key, refetch])

	if (data || responseActive === key) {
		return null
	}

	return (
		<div className="flex items-center gap-1 p-2">
			<Button variant="ghost" size="sm" onClick={onResetLeaf}>
				<X size={16} />
			</Button>
			<h4>
				{rephraseMethods.find((m) => m.id === methodId)?.method} working...
			</h4>
			<Spinner size={24} />
		</div>
	)
}
