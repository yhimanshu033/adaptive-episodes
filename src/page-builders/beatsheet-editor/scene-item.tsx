import React from 'react'
import { SparklesSoftIcon } from '@/icons/sparkles-soft-icon'
import SceneContent, {
	SceneContentProps,
} from '@/page-builders/beatsheet-editor/scene-content'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { Trash2 } from 'lucide-react'

import { IconButton } from '@/components/aural-ui/icon-button'
import {
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion'

import { SortableScene } from './sortable-scene'

interface SceneItemProps extends SceneContentProps {
	idx: number

	onDelete: () => void
	onOpenPrompt: () => void
}
export default function SceneItem({
	idx,
	isGenerating,
	onDelete,
	onOpenPrompt,
	scene,
	...sceneContentProps
}: SceneItemProps) {
	return (
		<SortableScene key={scene.id} id={scene.id}>
			<AccordionItem key={idx} value={scene.id}>
				<AccordionTrigger className="flex items-center">
					<div className="flex flex-1 items-center justify-between">
						<div className="flex items-center gap-2">
							<h3 className="font-bold">{scene.title}</h3>
						</div>
						<div className="flex items-center justify-center gap-2">
							<IconButton
								label="Scene Prompt"
								icon={<SparklesSoftIcon />}
								onClick={(e) => {
									e.stopPropagation()
									onOpenPrompt()
								}}
								variant="ghost"
								size="small"
								disabled={isGenerating}
							/>
							<IconButton
								label="Delete Scene"
								icon={<Trash2 size={18} />}
								onClick={(e) => {
									e.stopPropagation()
									onDelete()
								}}
								variant="ghost"
								size="small"
								disabled={isGenerating}
							/>
						</div>
					</div>
				</AccordionTrigger>
				<SortableContext
					items={scene.beats.map((beat) => beat.id)}
					strategy={verticalListSortingStrategy}
				>
					<AccordionContent className="relative space-y-2">
						<SceneContent
							isGenerating={isGenerating}
							scene={scene}
							{...sceneContentProps}
						/>
					</AccordionContent>
				</SortableContext>
			</AccordionItem>
		</SortableScene>
	)
}
