import React, { useCallback, useMemo } from 'react'
import { TOutlinerBeatEditable } from '@/page-builders/plate-editor/sidebar-sections/outliner/lib/types'
import useOutliner from '@/page-builders/plate-editor/sidebar-sections/outliner/provider'
import { capitalize } from 'lodash'

import Label from '@/components/aural-ui/label'
import TextArea from '@/components/aural-ui/textarea'
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion'
import ForEach from '@/components/ui/for-each'
import { cn } from '@/lib/aural-ui/utils'

export default function OutlinerBeats() {
	const {
		outlinerData,
		setSelectedOutlinerTabData,
		selectedOutlinerTabData,
		selectedSceneIdx,
		selectedSummaryIdx,
		isChatOpen,
	} = useOutliner()

	const handleBeatSelect = useCallback(
		(beatIdx: number) => {
			setSelectedOutlinerTabData((prev) => {
				return {
					...prev,
					beatIdx: beatIdx === prev?.beatIdx ? undefined : beatIdx,
				}
			})
		},
		[setSelectedOutlinerTabData]
	)

	const outlinerBeats = useMemo(() => {
		return outlinerData?.[selectedSummaryIdx]?.scenes?.[selectedSceneIdx]?.beats
	}, [outlinerData, selectedSummaryIdx, selectedSceneIdx])

	if (!outlinerBeats) {
		return null
	}

	return (
		<div className="">
			<Accordion
				value={String(selectedOutlinerTabData?.beatIdx)}
				type="single"
				className="w-full"
			>
				<ForEach data={outlinerBeats}>
					{(outlinerBeatItem, outlinerBeatItemIdx) => {
						return (
							<AccordionItem
								value={String(outlinerBeatItemIdx)}
								key={`outlinerBeatItem-${outlinerBeatItemIdx}`}
								className={cn('px-2 transition-colors', {
									'~bg-fm-hotpink-200/30':
										isChatOpen &&
										selectedOutlinerTabData?.beatIdx === outlinerBeatItemIdx,
								})}
							>
								<AccordionTrigger
									onClick={() => handleBeatSelect(outlinerBeatItemIdx)}
								>
									{outlinerBeatItem.type
										? outlinerBeatItem.type
										: `Beat ${outlinerBeatItemIdx + 1}`}
								</AccordionTrigger>
								<AccordionContent>
									<ForEach
										data={
											['description', 'function'] as TOutlinerBeatEditable[]
										}
									>
										{(item, idx) => {
											return (
												<div
													key={`outliner-scene-content-${idx}`}
													className="mt-2"
												>
													<Label className="mb-1" required={false}>
														{capitalize(item)}
													</Label>
													<TextArea
														value={outlinerBeatItem?.[item] ?? ''}
														disabled
														classes={{
															textarea: 'disabled:text-foreground!',
														}}
														onChange={() => {
															// handleBeatChange({
															// 	summaryIdx: selectedSummaryIdx,
															// 	sceneIdx: selectedSceneIdx,
															// 	beatIdx: outlinerBeatItemIdx,
															// 	value: e.target.value ?? '',
															// 	beatKey: item,
															// })
														}}
													/>
												</div>
											)
										}}
									</ForEach>
								</AccordionContent>
							</AccordionItem>
						)
					}}
				</ForEach>
			</Accordion>
		</div>
	)
}
