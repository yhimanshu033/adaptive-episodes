import React from 'react'
import useEpisodeIdStore from '@/store/episode-id-store'
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
					{DUAL_VIEW_MODES.map((mode, index) => (
						<SelectItem key={index} value={mode}>
							{MODE_TO_TITLE[mode]}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</>
	)
}
