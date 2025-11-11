import React from 'react'
import {
	TOutlinerData,
	TOutlinerSceneEditable,
} from '@/page-builders/plate-editor/sidebar-sections/outliner/lib/types'
import OutlinerBeats from '@/page-builders/plate-editor/sidebar-sections/outliner/outliner-beats'
import useOutliner from '@/page-builders/plate-editor/sidebar-sections/outliner/provider'
import { capitalize } from 'lodash'

import { Else, If, IfElse } from '@/components/aural-ui/if-else'
import Label from '@/components/aural-ui/label'
import TextArea from '@/components/aural-ui/textarea'
import {
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion'
import ForEach from '@/components/ui/for-each'
import { cn } from '@/lib/aural-ui/utils'

interface OutlinerScenesItemProps {
	outlinerSceneItem: NonNullable<TOutlinerData[number]['scenes']>[number]
	outlinerSceneItemIdx: number
}
export default function OutlinerScenesItem({
	outlinerSceneItem,
	outlinerSceneItemIdx,
}: OutlinerScenesItemProps) {
	const {
		selectedOutlinerTabData,
		isSomeSceneZoomed,
		isChatOpen,
		openSceneIdx,
		handleSceneSelect,
		shouldShowSceneAccordion,
	} = useOutliner()

	return (
		<AccordionItem
			value={String(outlinerSceneItemIdx)}
			key={`outlinerSceneItem-${outlinerSceneItemIdx}`}
			className={cn(
				'h-full overflow-hidden px-2 transition-all',
				{
					'~bg-fm-hotpink-200/30':
						isChatOpen &&
						!isSomeSceneZoomed &&
						selectedOutlinerTabData?.sceneIdx === outlinerSceneItemIdx,
				},
				{
					'border-transparent': isSomeSceneZoomed,
				}
			)}
		>
			<AccordionTrigger
				className={cn(
					'overflow-clip transition-[max-height,padding]',
					shouldShowSceneAccordion(outlinerSceneItemIdx)
						? 'max-h-[60px]'
						: 'max-h-0 p-0'
				)}
				onClick={() => handleSceneSelect(outlinerSceneItemIdx)}
			>
				<p>
					<span className="mr-2">{outlinerSceneItemIdx + 1}.</span>
					{outlinerSceneItem.location}
				</p>
			</AccordionTrigger>
			<AccordionContent>
				<IfElse
					condition={isSomeSceneZoomed && outlinerSceneItemIdx === openSceneIdx}
				>
					<If>
						<OutlinerBeats />
					</If>
					<Else>
						<ForEach
							data={
								[
									'summary',
									'setup',
									'turns',
									'cliff',
								] as TOutlinerSceneEditable[]
							}
						>
							{(item, idx) => {
								return (
									<div key={`outliner-scene-content-${idx}`} className="mt-2">
										<Label className="mb-1" required={false}>
											{capitalize(item)}
										</Label>
										<TextArea
											value={outlinerSceneItem?.[item] ?? ''}
											classes={{
												textarea: 'disabled:text-foreground!',
											}}
											disabled
											onChange={() => {
												// handleSceneChange({
												// 	summaryIdx: selectedSummaryIdx,
												// 	sceneIdx: outlinerSceneItemIdx,
												// 	value: e.target.value ?? '',
												// 	key: item,
												// })
											}}
										/>
									</div>
								)
							}}
						</ForEach>
					</Else>
				</IfElse>
			</AccordionContent>
		</AccordionItem>
	)
}
