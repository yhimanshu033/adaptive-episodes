import React, { useEffect, useMemo } from 'react'
import useEpisodeContent from '@/hooks/query/use-episode-content'
import useAccessChecks from '@/hooks/use-access-checks'
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
	const { isGerman } = useAccessChecks()

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
		return DUAL_VIEW_MODES.filter((item) => !excludedModes.includes(item))
	}, [data?.previous_parent_id, data?.next_parent_id, localDiffValue])

	useEffect(() => {
		if (modes.includes(dualViewMode)) {
			return
		}

		setDualViewMode(modes[0])
	}, [modes, dualViewMode, setDualViewMode])

	const modeToTitle = useMemo(() => {
		if (!isGerman) {
			MODE_TO_TITLE[EDualVIewMode.US_TRANSLATION] = 'Source Script'
		}
		return MODE_TO_TITLE
	}, [isGerman])

	return (
		<Select
			value={dualViewMode}
			onValueChange={(value) => setDualViewMode(value as EDualVIewMode)}
		>
			<SelectTrigger className="bg-background/30 w-fit gap-2 backdrop-blur-[1px]">
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
