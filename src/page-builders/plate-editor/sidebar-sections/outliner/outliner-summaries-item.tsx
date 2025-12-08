import React, { useMemo } from 'react'
import useIsFirstEp from '@/page-builders/plate-editor/sidebar-sections/outliner/hooks/use-is-initial-base'
import { TOutlinerData } from '@/page-builders/plate-editor/sidebar-sections/outliner/lib/types'
import OutlinerNewIdeas from '@/page-builders/plate-editor/sidebar-sections/outliner/outliner-new-ideas'
import OutlinerSummariesItemContent from '@/page-builders/plate-editor/sidebar-sections/outliner/outliner-summaries-item-content'
import useOutliner from '@/page-builders/plate-editor/sidebar-sections/outliner/provider'

import { IfElse } from '@/components/aural-ui/if-else'
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
	const isFirst = useIsFirstEp()

	const showStoryIdea = useMemo(() => {
		return !!isFirst && outlinerSummaryItemIdx === 0
	}, [isFirst, outlinerSummaryItemIdx])

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
				{showStoryIdea ? 'Selected Story Idea' : outlinerSummaryItem.title}
			</AccordionTrigger>
			<AccordionContent>
				<IfElse
					condition={showStoryIdea}
					if={<OutlinerNewIdeas />}
					else={
						<OutlinerSummariesItemContent
							outlinerSummaryItem={outlinerSummaryItem}
							outlinerSummaryItemIdx={outlinerSummaryItemIdx}
						/>
					}
				/>
			</AccordionContent>
		</AccordionItem>
	)
}
