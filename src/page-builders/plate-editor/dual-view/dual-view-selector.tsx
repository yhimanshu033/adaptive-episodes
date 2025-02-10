import React from 'react'
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

	const localDiffValue = useEpisodePlateStore(
		useShallow((state) => state.localDiffValue)
	)
	const modes = localDiffValue
		? [...DUAL_VIEW_MODES, EDualVIewMode.LOCAL_DIFF]
		: DUAL_VIEW_MODES
	return (
		<>
			<Select
				value={dualViewMode}
				onValueChange={(value) => setDualViewMode(value as EDualVIewMode)}
			>
				<SelectTrigger className="w-fit gap-2">
					<SelectValue placeholder="Mode" />
				</SelectTrigger>
				<SelectContent>
					{modes.map((mode, index) => (
						<SelectItem key={index} value={mode}>
							{MODE_TO_TITLE[mode]}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</>
	)
}
