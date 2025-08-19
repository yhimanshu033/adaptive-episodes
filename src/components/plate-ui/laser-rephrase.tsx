import React, { useEffect } from 'react'
import { rephraseMethods } from '@/constants/editor-constants'
import { languageToTitle } from '@/constants/episodes-constants'
import useEditorData from '@/hooks/plate/use-editor-data'
import useEpisodeContent from '@/hooks/query/use-episode-content'
import useLaserToolsQuery from '@/hooks/query/use-lasertool-data'
import useLanguage from '@/hooks/use-language'
import useLaserStore from '@/store/laser-store'
import { X } from 'lucide-react'
import { useShallow } from 'zustand/react/shallow'

import Image from '@/components/ui/image'
import { getText } from '@/lib/utils/plate'

import { LaserToolsParams } from '@/types/ai-types'
import { RephraseSelectionProps } from '@/types/editor-types'

import CircularLoader from '../aural-ui/circular-loader'
import { IconButton } from '../aural-ui/icon-button'

export default function LaserRephrase({
	getSelectedText,
	methodId,
	elemKey: key,
	onResetLeaf,
	promptInput,
	setResponseMode,
	additionalContext,
}: RephraseSelectionProps) {
	const { data: episodeContent } = useEpisodeContent()
	const { children } = useEditorData()

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
		additional_context: additionalContext,
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
		<div className="rounded-fm-l border-fm-divider-primary bg-fm-surface-primary relative flex w-full items-center justify-between gap-2 overflow-hidden border py-2 pr-2 pl-5 shadow-lg">
			<Image
				alt="laser gradient"
				className="pointer-events-none absolute top-0 z-0"
				src="/assets/laser-bg-gradient.png"
			/>
			<div className="flex items-center gap-2">
				<CircularLoader className="size-5" />
				<p className="leading-fm-md [background-image:linear-gradient(270deg,var(--color-fm-placeholder)_12.22%,var(--color-fm-primary)_31.77%,var(--color-fm-primary)_67.87%,var(--color-fm-placeholder)_96.75%)] bg-clip-text [font-size:var(--text-fm-md)] font-medium text-transparent">
					{rephraseMethods.find((m) => m.id === methodId)?.status}
				</p>
			</div>
			<IconButton
				onClick={onResetLeaf}
				icon={<X size={16} />}
				label="Close"
				variant="ghost"
			/>
		</div>
	)
}
