import React, { useMemo } from 'react'
import useEpisodeContent from '@/hooks/query/use-episode-content'
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
	}, [localDiffValue, data])

	return (
		<Select
			value={dualViewMode}
			onValueChange={(value) => setDualViewMode(value as EDualVIewMode)}
		>
			<SelectTrigger className="w-fit gap-2 bg-background/30 backdrop-blur-[1px]">
				<SelectValue placeholder="Mode">
					Dual View: {MODE_TO_TITLE[dualViewMode]}
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
