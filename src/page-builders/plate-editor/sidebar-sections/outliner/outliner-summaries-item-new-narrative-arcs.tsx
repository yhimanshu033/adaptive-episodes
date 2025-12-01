import React, { useCallback, useEffect, useMemo, useRef } from 'react'
import { EFeedback } from '@/constants/analytics'
import { CrossIcon } from '@/icons/cross-icon'
import { TickIcon } from '@/icons/tick-icon'
import { getOutlinerNewNarrativeArcsOptions } from '@/page-builders/plate-editor/sidebar-sections/outliner/lib/fns'
import { TOutlinerData } from '@/page-builders/plate-editor/sidebar-sections/outliner/lib/types'
import useOutliner from '@/page-builders/plate-editor/sidebar-sections/outliner/provider'
import { RefreshCcw } from 'lucide-react'

import DotLoader from '@/components/aural-ui/dot-loader'
import { IconButton } from '@/components/aural-ui/icon-button'
import { If } from '@/components/aural-ui/if-else'
import { TextAreaProps } from '@/components/aural-ui/textarea'
import MultiTextArea from '@/components/multi-text-area'
import { OutlinerFeedback } from '@/components/outliner-feedback'

interface OutlinerSummariesItemProps {
	outlinerSummaryItem: TOutlinerData[number]
	outlinerSummaryItemIdx: number
}
export default function OutlinerSummariesItemNewNarrativeArcs({
	outlinerSummaryItem,
	outlinerSummaryItemIdx,
}: OutlinerSummariesItemProps) {
	const {
		handleNewIdeaChange,
		handleNewIdeaReject,
		handleNewIdeaAccept,
		handleNewIdeaNavigate,
		startNewNarrativeArcsGeneration,
		newNarrativeArcsTaskId,
		streamedNewNarrativeArcs,
		lastMessageGeneratingNewIdeaIdx,
		isNewNarrativeArcsStreaming,
		handleNarrativeArcsFeedback,
		completedTaskId,
	} = useOutliner()
	const startTaskSent = useRef(false)

	const options = useMemo(() => {
		if (isNewNarrativeArcsStreaming) {
			return getOutlinerNewNarrativeArcsOptions({
				newNarrativeArcs: streamedNewNarrativeArcs || [],
			})
		}
		return outlinerSummaryItem?.multiSelectOptions
	}, [
		streamedNewNarrativeArcs,
		outlinerSummaryItem,
		isNewNarrativeArcsStreaming,
	])

	const textareaOpts = useMemo(() => {
		if (!options) {
			return []
		}
		return options.map((multiSelectOption, multiSelectOptionIdx) => {
			return {
				title: multiSelectOption.title || 'Title',
				isGenerating:
					isNewNarrativeArcsStreaming ||
					multiSelectOptionIdx === lastMessageGeneratingNewIdeaIdx,
				props: {
					placeholder: 'Write your own ideas here...',
					value: multiSelectOption.summary ?? '',
					onChange: (e) => {
						handleNewIdeaChange({
							optionIdx: multiSelectOptionIdx,
							summaryIdx: outlinerSummaryItemIdx,
							value: e.target.value,
						})
					},
				} as TextAreaProps,
			}
		})
	}, [
		handleNewIdeaChange,
		isNewNarrativeArcsStreaming,
		outlinerSummaryItemIdx,
		options,
		lastMessageGeneratingNewIdeaIdx,
	])

	const handleRetry = useCallback(() => {
		handleNewIdeaNavigate({
			summaryIdx: outlinerSummaryItemIdx,
			optionIdx: 0,
		})
		void startNewNarrativeArcsGeneration(true)
	}, [
		startNewNarrativeArcsGeneration,
		handleNewIdeaNavigate,
		outlinerSummaryItemIdx,
	])

	useEffect(() => {
		if (startTaskSent.current) {
			return
		}
		if (textareaOpts.length > 0) {
			return
		}
		if (newNarrativeArcsTaskId) {
			return
		}
		void startNewNarrativeArcsGeneration()
		startTaskSent.current = true
	}, [
		newNarrativeArcsTaskId,
		startNewNarrativeArcsGeneration,
		textareaOpts.length,
	])

	if (!textareaOpts.length) {
		return (
			<div className="flex h-full flex-col justify-center">
				<DotLoader />
			</div>
		)
	}

	return (
		<>
			<MultiTextArea
				active={outlinerSummaryItem.multiSelectSelectedOption}
				setActive={(idx) => {
					handleNewIdeaNavigate({
						summaryIdx: outlinerSummaryItemIdx,
						optionIdx: idx,
					})
				}}
				textarea={textareaOpts}
			/>
			<div className="mt-2 flex items-center justify-between gap-2">
				<div className="flex items-center gap-2">
					<If
						condition={
							!isNewNarrativeArcsStreaming && !!completedTaskId.newNarrativeArcs
						}
					>
						<OutlinerFeedback
							onLike={(comment) =>
								handleNarrativeArcsFeedback(EFeedback.LIKE, comment)
							}
							onDislike={(comment) =>
								handleNarrativeArcsFeedback(EFeedback.DISLIKE, comment)
							}
						/>
					</If>
					<IconButton
						label="Regenerate Ideas"
						variant="ghost"
						disabled={
							isNewNarrativeArcsStreaming ||
							lastMessageGeneratingNewIdeaIdx !== undefined
						}
						tooltip="Regenerate Ideas"
						icon={<RefreshCcw />}
						onClick={handleRetry}
						size="small"
					/>
				</div>

				<div className="flex items-center gap-2">
					<IconButton
						tooltip="Reject Idea"
						label="Reject Idea"
						variant="outlined"
						size="small"
						disabled={
							isNewNarrativeArcsStreaming ||
							lastMessageGeneratingNewIdeaIdx !== undefined
						}
						icon={<CrossIcon />}
						onClick={() => {
							handleNewIdeaReject({
								summaryIdx: outlinerSummaryItemIdx,
								optionIdx: outlinerSummaryItem.multiSelectSelectedOption,
							})
						}}
					/>
					<IconButton
						tooltip="Accept Idea"
						label="Accept Idea"
						variant="outlined"
						disabled={
							isNewNarrativeArcsStreaming ||
							lastMessageGeneratingNewIdeaIdx !== undefined
						}
						size="small"
						icon={<TickIcon />}
						onClick={() => {
							handleNewIdeaAccept({
								summaryIdx: outlinerSummaryItemIdx,
								optionIdx: outlinerSummaryItem.multiSelectSelectedOption,
							})
						}}
					/>
				</div>
			</div>
		</>
	)
}
