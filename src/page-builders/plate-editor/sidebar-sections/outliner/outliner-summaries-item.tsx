import React, { useMemo } from 'react'
import useIsFirstEp from '@/page-builders/plate-editor/sidebar-sections/outliner/hooks/use-is-initial-base'
import { TOutlinerData } from '@/page-builders/plate-editor/sidebar-sections/outliner/lib/types'
import OutlinerNewIdeas from '@/page-builders/plate-editor/sidebar-sections/outliner/outliner-new-ideas'
import OutlinerSummariesItemContent from '@/page-builders/plate-editor/sidebar-sections/outliner/outliner-summaries-item-content'
import useOutliner from '@/page-builders/plate-editor/sidebar-sections/outliner/provider'
import { Info } from 'lucide-react'

import { IconButton } from '@/components/aural-ui/icon-button'
import { If, IfElse } from '@/components/aural-ui/if-else'
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
		areSummariesSynced,
		summaryEpisodeTaskId,
		summaryOutlineTaskId,
		handleGenerateOutline,
	} = useOutliner()
	const isFirst = useIsFirstEp()

	const showStoryIdea = useMemo(() => {
		return !!isFirst && outlinerSummaryItemIdx === 0
	}, [isFirst, outlinerSummaryItemIdx])

	const showSyncTooltip = useMemo(() => {
		return (
			!!outlinerSummaryItem.summary &&
			outlinerSummaryItemIdx === 1 &&
			!areSummariesSynced &&
			!summaryEpisodeTaskId &&
			!summaryOutlineTaskId
		)
	}, [
		outlinerSummaryItem.summary,
		outlinerSummaryItemIdx,
		areSummariesSynced,
		summaryEpisodeTaskId,
		summaryOutlineTaskId,
	])

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
				<div className="flex items-center gap-2">
					{showStoryIdea ? 'Selected Story Idea' : outlinerSummaryItem.title}
					<If condition={showSyncTooltip}>
						<IconButton
							variant="ghost"
							className="text-fm-secondary-800 size-4 p-0!"
							label="Your summary is out of sync with the saved version. Please Click to Sync!"
							tooltip="Your summary is out of sync with the saved version. Please Click to Sync!"
							icon={<Info />}
							size="small"
							onClick={(e) => {
								e.stopPropagation()
								void handleGenerateOutline({
									summaryIdx: outlinerSummaryItemIdx,
								})
							}}
						/>
					</If>
				</div>
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
