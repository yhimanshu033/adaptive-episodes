import React, { useMemo } from 'react'
import { TOutlinerData } from '@/page-builders/plate-editor/sidebar-sections/outliner/lib/types'
import OutlinerScenes from '@/page-builders/plate-editor/sidebar-sections/outliner/outliner-scenes'
import OutlinerStreamedResponse from '@/page-builders/plate-editor/sidebar-sections/outliner/outliner-streamed-response'
import OutlinerSummariesItemNewIdeas from '@/page-builders/plate-editor/sidebar-sections/outliner/outliner-summaries-item-new-ideas'
import OutlinerSummariesItemNewNarrativeArcs from '@/page-builders/plate-editor/sidebar-sections/outliner/outliner-summaries-item-new-narrative-arcs'
import OutlinerSummaryEpGeneration from '@/page-builders/plate-editor/sidebar-sections/outliner/outliner-summary-ep-generation'
import useOutliner from '@/page-builders/plate-editor/sidebar-sections/outliner/provider'
import { File, ListTree } from 'lucide-react'

import CircularLoader from '@/components/aural-ui/circular-loader'
import { IconButton } from '@/components/aural-ui/icon-button'
import { Else, If, IfElse } from '@/components/aural-ui/if-else'
import TextArea from '@/components/aural-ui/textarea'

interface OutlinerSummariesItemProps {
	outlinerSummaryItem: TOutlinerData[number]
	outlinerSummaryItemIdx: number
}
export default function OutlinerSummariesItemContent({
	outlinerSummaryItem,
	outlinerSummaryItemIdx,
}: OutlinerSummariesItemProps) {
	const {
		isSomeSummaryZoomed,
		outlinerData,
		handleSummaryValueChange,
		handleGenerateOutline,
		handleGenerateContentFromSummary,
		summaryEpisodeTaskId,
		isLastGeneratingMessage,
		summaryOutlineTaskId,
		isSummaryOutlinePending,
		isCachedScenesSaving,
		debouncedNarrativeArcsPlan,
		isUpdatingNarrativeArcs,
	} = useOutliner()

	const isGenerating = useMemo(() => {
		return isLastGeneratingMessage({ summaryIdx: outlinerSummaryItemIdx })
	}, [isLastGeneratingMessage, outlinerSummaryItemIdx])

	const isOutlineGenerationDisabled = useMemo(() => {
		return (
			!!summaryOutlineTaskId ||
			isSummaryOutlinePending ||
			isCachedScenesSaving ||
			!!summaryEpisodeTaskId
		)
	}, [
		isCachedScenesSaving,
		isSummaryOutlinePending,
		summaryOutlineTaskId,
		summaryEpisodeTaskId,
	])

	const saveMessage = useMemo(() => {
		if (outlinerSummaryItemIdx !== 2) {
			return
		}
		if (outlinerSummaryItem.summary !== debouncedNarrativeArcsPlan) {
			return 'Unsaved'
		}
		if (isUpdatingNarrativeArcs) {
			return 'Saving'
		}
		return 'Saved'
	}, [
		isUpdatingNarrativeArcs,
		outlinerSummaryItem,
		debouncedNarrativeArcsPlan,
		outlinerSummaryItemIdx,
	])

	if (isSomeSummaryZoomed) {
		return <OutlinerScenes />
	}

	if (
		!!summaryEpisodeTaskId &&
		outlinerSummaryItemIdx === 1 &&
		!!outlinerSummaryItem.summary
	) {
		return <OutlinerSummaryEpGeneration />
	}

	if (!outlinerSummaryItem.isEditable) {
		return <p>{outlinerSummaryItem.summary}</p>
	}

	if (outlinerSummaryItem.multiSelectOptions && outlinerSummaryItemIdx === 1) {
		return (
			<OutlinerSummariesItemNewIdeas
				outlinerSummaryItem={outlinerSummaryItem}
				outlinerSummaryItemIdx={outlinerSummaryItemIdx}
			/>
		)
	}

	if (outlinerSummaryItem.multiSelectOptions && outlinerSummaryItemIdx === 2) {
		return (
			<OutlinerSummariesItemNewNarrativeArcs
				outlinerSummaryItem={outlinerSummaryItem}
				outlinerSummaryItemIdx={outlinerSummaryItemIdx}
			/>
		)
	}

	return (
		<>
			<IfElse condition={!isGenerating}>
				<If>
					<TextArea
						value={outlinerSummaryItem.summary}
						onChange={(e) => {
							handleSummaryValueChange({
								summaryIdx: outlinerSummaryItemIdx,
								value: e.target.value,
							})
						}}
					/>
					<If condition={!!saveMessage}>
						<div className="font-fm-brand text-fm-placeholder! text-fm-sm mt-1 flex justify-end uppercase">
							{saveMessage}
						</div>
					</If>
				</If>
				<Else>
					<OutlinerStreamedResponse response={outlinerSummaryItem.summary} />
				</Else>
			</IfElse>

			<If condition={outlinerSummaryItemIdx === 1}>
				<div className="mt-2 flex items-center justify-between gap-2">
					<IconButton
						variant="outlined"
						label={
							outlinerData?.[outlinerSummaryItemIdx].scenes
								? 'Regenerate Outline'
								: 'Generate Outline'
						}
						tooltip={
							outlinerData?.[outlinerSummaryItemIdx].scenes
								? 'Regenerate Outline'
								: 'Generate Outline'
						}
						disabled={isOutlineGenerationDisabled}
						icon={
							isOutlineGenerationDisabled ? <CircularLoader /> : <ListTree />
						}
						size="small"
						onClick={() => {
							void handleGenerateOutline({
								summaryIdx: outlinerSummaryItemIdx,
							})
						}}
					/>

					<IconButton
						variant="outlined"
						label="Generate Content"
						tooltip="Generate Content"
						disabled={!!summaryEpisodeTaskId}
						icon={summaryEpisodeTaskId ? <CircularLoader /> : <File />}
						size="small"
						onClick={() => {
							void handleGenerateContentFromSummary()
						}}
					/>
				</div>
			</If>
		</>
	)
}
