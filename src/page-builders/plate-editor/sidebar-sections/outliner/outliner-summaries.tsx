import React from 'react'
import OutlinerSummariesItem from '@/page-builders/plate-editor/sidebar-sections/outliner/outliner-summaries-item'
import useOutliner from '@/page-builders/plate-editor/sidebar-sections/outliner/provider'

import { Accordion } from '@/components/ui/accordion'
import ForEach from '@/components/ui/for-each'

export default function OutlinerSummaries() {
	const { outlinerData, openSummaryIdx } = useOutliner()

	if (!outlinerData) {
		return null
	}

	return (
		<div className="">
			<Accordion
				value={String(openSummaryIdx)}
				type="single"
				className="w-full"
			>
				<ForEach data={outlinerData}>
					{(outlinerSummaryItem, outlinerSummaryItemIdx) => {
						return (
							<OutlinerSummariesItem
								outlinerSummaryItem={outlinerSummaryItem}
								outlinerSummaryItemIdx={outlinerSummaryItemIdx}
								key={`outlinerSummaryItem-${outlinerSummaryItemIdx}`}
							/>
						)
					}}
				</ForEach>
			</Accordion>
		</div>
	)
}
