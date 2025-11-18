import React, { useEffect } from 'react'
import GenerateTab from '@/page-builders/plate-editor/sidebar-sections/outliner/generate-tab'
import { EOutlinerTab } from '@/page-builders/plate-editor/sidebar-sections/outliner/lib/types'
import OutlinerSummaries from '@/page-builders/plate-editor/sidebar-sections/outliner/outliner-summaries'
import useOutliner from '@/page-builders/plate-editor/sidebar-sections/outliner/provider'

import DotLoader from '@/components/aural-ui/dot-loader'
import { If } from '@/components/aural-ui/if-else'
import LoaderTexts from '@/components/ui/loader-texts'
import { ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'

export default function OutlinerContent() {
	const {
		outlinerTab,
		outlinerTabData,
		outlinerData,
		handleOutlinerDataFetch,
	} = useOutliner()

	useEffect(() => {
		void handleOutlinerDataFetch()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	if (!outlinerData) {
		return (
			<div className="flex h-full flex-col justify-center gap-4">
				<DotLoader />
				<LoaderTexts />
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
				defaultSize={50}
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
