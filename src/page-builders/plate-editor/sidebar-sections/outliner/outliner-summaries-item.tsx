import React from 'react'
import { TOutlinerData } from '@/page-builders/plate-editor/sidebar-sections/outliner/lib/types'
import OutlinerSummariesItemContent from '@/page-builders/plate-editor/sidebar-sections/outliner/outliner-summaries-item-content'
import useOutliner from '@/page-builders/plate-editor/sidebar-sections/outliner/provider'

import {
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion'
import { cn } from '@/lib/aural-ui/utils'

interface OutlinerSummariesItemProps {
	outlinerSummaryItem: TOutlinerData[number]
	outlinerSummaryItemIdx: number
}
export default function OutlinerSummariesItem({
	outlinerSummaryItem,
	outlinerSummaryItemIdx,
}: OutlinerSummariesItemProps) {
	const {
		shouldShowSummaryAccordion,
		isChatOpen,
		isSomeSummaryZoomed,
		selectedOutlinerTabData,
		handleSummarySelect,
	} = useOutliner()

	return (
		<AccordionItem
			value={String(outlinerSummaryItemIdx)}
			key={`outlinerSummaryItem-${outlinerSummaryItemIdx}`}
			className={cn(
				'px-6',
				{
					'bg-fm-hotpink-200/30':
						isChatOpen &&
						!isSomeSummaryZoomed &&
						selectedOutlinerTabData?.summaryIdx === outlinerSummaryItemIdx,
				},
				{
					'border-transparent': isSomeSummaryZoomed,
				}
			)}
		>
			<AccordionTrigger
				className={cn(
					'overflow-clip transition-[max-height,padding]',
					shouldShowSummaryAccordion(outlinerSummaryItemIdx)
						? 'max-h-[60px]'
						: 'max-h-0 p-0'
				)}
				onClick={() => handleSummarySelect(outlinerSummaryItemIdx)}
			>
				{outlinerSummaryItem.title}
			</AccordionTrigger>
			<AccordionContent>
				<OutlinerSummariesItemContent
					outlinerSummaryItem={outlinerSummaryItem}
					outlinerSummaryItemIdx={outlinerSummaryItemIdx}
				/>
			</AccordionContent>
		</AccordionItem>
	)
}
