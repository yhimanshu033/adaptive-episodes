import React, { useMemo } from 'react'
import OutlinerScenesItem from '@/page-builders/plate-editor/sidebar-sections/outliner/outliner-scenes-item'
import useOutliner from '@/page-builders/plate-editor/sidebar-sections/outliner/provider'

import CircularLoader from '@/components/aural-ui/circular-loader'
import { If } from '@/components/aural-ui/if-else'
import { Accordion } from '@/components/ui/accordion'
import ForEach from '@/components/ui/for-each'

export default function OutlinerScenes() {
	const {
		outlinerData,
		selectedSummaryIdx,
		openSceneIdx,
		summaryOutlineTaskId,
		isSummaryOutlinePending,
	} = useOutliner()

	const outlinerScenes = useMemo(() => {
		return outlinerData?.[selectedSummaryIdx]?.scenes || []
	}, [outlinerData, selectedSummaryIdx])

	if (!outlinerScenes) {
		return null
	}

	return (
		<div className="">
			<If condition={!!summaryOutlineTaskId || isSummaryOutlinePending}>
				<p className="flex items-center gap-2">
					<span className="animate-gradient-slide bg-clip-text text-transparent">
						Generating Outline
					</span>
					<span>
						<CircularLoader className="size-4" />
					</span>
				</p>
			</If>
			<Accordion value={String(openSceneIdx)} type="single" className="w-full">
				<ForEach data={outlinerScenes}>
					{(outlinerSceneItem, outlinerSceneItemIdx) => {
						return (
							<OutlinerScenesItem
								outlinerSceneItem={outlinerSceneItem}
								outlinerSceneItemIdx={outlinerSceneItemIdx}
								key={outlinerSceneItemIdx}
							/>
						)
					}}
				</ForEach>
			</Accordion>
		</div>
	)
}
