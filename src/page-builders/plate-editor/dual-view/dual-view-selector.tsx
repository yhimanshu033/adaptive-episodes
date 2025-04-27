import React, { useEffect, useMemo } from 'react'
import useEpisodeContent from '@/hooks/query/use-episode-content'
import useIsGerman from '@/hooks/use-is-german'
import useEpisodeIdStore from '@/store/episode-id-store'
import usePlateStore from '@/store/plate-store'
import { useShallow } from 'zustand/react/shallow'

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'

import {
	DUAL_VIEW_MODES,
	EDualVIewMode,
	MODE_TO_TITLE,
} from '@/types/episode-type'

export default function DualViewSelector() {
	const { store: useEpisodeIdStoreContext, setDualViewMode } =
		useEpisodeIdStore()
	const dualViewMode = useEpisodeIdStoreContext(
		useShallow((state) => state.dualViewMode)
	)
	const { store: useEpisodePlateStore } = usePlateStore()
	const isGerman = useIsGerman()

	const { data } = useEpisodeContent()
	const localDiffValue = useEpisodePlateStore(
		useShallow((state) => state.localDiffValue)
	)
	const modes = useMemo(() => {
		const excludedModes: EDualVIewMode[] = []
		if (!data?.previous_parent_id) {
			excludedModes.push(EDualVIewMode.PREV_EP)
		}
		if (!data?.next_parent_id) {
			excludedModes.push(EDualVIewMode.NEXT_EP)
		}
		if (!localDiffValue) {
			excludedModes.push(EDualVIewMode.LOCAL_DIFF)
		}
		if (!isGerman) {
			excludedModes.push(EDualVIewMode.US_TRANSLATION)
		}
		return DUAL_VIEW_MODES.filter((item) => !excludedModes.includes(item))
	}, [localDiffValue, data, isGerman])

	useEffect(() => {
		if (modes.includes(dualViewMode)) {
			return
		}

		setDualViewMode(modes[0])
	}, [modes, dualViewMode, setDualViewMode])

	const modeToTitle = useMemo(() => {
		if (!isGerman) {
			MODE_TO_TITLE[EDualVIewMode.BASE_SCRIPT] = 'Original Script'
		}
		return MODE_TO_TITLE
	}, [isGerman])

	return (
		<Select
			value={dualViewMode}
			onValueChange={(value) => setDualViewMode(value as EDualVIewMode)}
		>
			<SelectTrigger className="w-fit gap-2 bg-background/30 backdrop-blur-[1px]">
				<SelectValue placeholder="Mode">
					Dual View: {modeToTitle[dualViewMode]}
				</SelectValue>
			</SelectTrigger>
			<SelectContent>
				{modes.map((mode, index) => (
					<SelectItem key={index} value={mode}>
						{MODE_TO_TITLE[mode]}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	)
}
