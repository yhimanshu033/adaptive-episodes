import React, { useEffect } from 'react'
import GenerateTab from '@/page-builders/plate-editor/sidebar-sections/outliner/generate-tab'
import useOutlinerData from '@/page-builders/plate-editor/sidebar-sections/outliner/hooks/use-outliner-data'
import { convertOutlinerData } from '@/page-builders/plate-editor/sidebar-sections/outliner/lib/fns'
import { EOutlinerTab } from '@/page-builders/plate-editor/sidebar-sections/outliner/lib/types'
import OutlinerSummaries from '@/page-builders/plate-editor/sidebar-sections/outliner/outliner-summaries'
import useOutliner from '@/page-builders/plate-editor/sidebar-sections/outliner/provider'

import DotLoader from '@/components/aural-ui/dot-loader'
import { If } from '@/components/aural-ui/if-else'
import { ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'

export default function OutlinerContent() {
	const {
		outlinerData,
		setOutlinerData,
		outlinerTab,
		setFetchedData,
		outlinerTabData,
	} = useOutliner()
	const { data: fetchedOutlinerData, isPending: isOutlinerDataPending } =
		useOutlinerData()

	useEffect(() => {
		if (!!outlinerData || !fetchedOutlinerData) {
			return
		}
		setFetchedData(fetchedOutlinerData)
		setOutlinerData(convertOutlinerData(fetchedOutlinerData))
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [fetchedOutlinerData, outlinerData])

	if (isOutlinerDataPending) {
		return (
			<div className="flex h-full flex-col justify-center">
				<DotLoader />
			</div>
		)
	}
	return (
		<ResizablePanelGroup
			direction="vertical"
			className="flex h-full overflow-visible!"
		>
			<ResizablePanel
				minSize={30}
				order={1}
				className="h-full w-full flex-1 overflow-y-scroll!"
			>
				<OutlinerSummaries />
			</ResizablePanel>
			{/* <div className="h-full overflow-hidden border-t"> */}
			<If
				condition={
					outlinerTab === EOutlinerTab.GENERATE &&
					outlinerTabData?.summaryIdx === undefined
				}
			>
				<GenerateTab />
			</If>
			{/* </div> */}
		</ResizablePanelGroup>
	)
}
