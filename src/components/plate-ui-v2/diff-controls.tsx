import React, { useCallback } from 'react'
import { DiffStatus } from '@/constants/ai-constants'
import useEpisodeIdStore from '@/store/episode-id-store'
import { Check, X } from 'lucide-react'
import { Descendant } from 'platejs'
import { PlateEditor } from 'platejs/react'

import { Button } from '@/components/aural-ui/button'
import { IconButton } from '@/components/aural-ui/icon-button'

export interface DiffControlsProps {
	editor: PlateEditor
	element: Descendant
}
export default function DiffControls({ element, editor }: DiffControlsProps) {
	const originalValue = editor.children
	const { setAcceptedDiffValue } = useEpisodeIdStore()

	const handleStatusChange = useCallback(
		(
			e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
			status: DiffStatus
		) => {
			e.stopPropagation()
			const value = structuredClone(originalValue)
			function findNode(node: Descendant) {
				if ('diff' in node) {
					if (node.diff_id === element.diff_id) {
						node.status = status
					}
				} else if ('children' in node) {
					;(node.children as Descendant[]).forEach(findNode)
				}
			}
			value.forEach(findNode)

			editor.tf.setValue(value)
			setAcceptedDiffValue(value)
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[originalValue, element.diff_id, editor.tf]
	)
	return (
		<div className="absolute top-2/5 z-50 flex translate-x-full gap-2 pl-10">
			<Button
				variant="outline"
				size="sm"
				onClick={(e) => handleStatusChange(e, DiffStatus.ACCEPTED)}
				innerClassName="h-8 "
			>
				<Check size={16} />
				<p>Apply</p>
			</Button>
			<IconButton
				variant="outlined"
				size="small"
				tooltip="Reject SFX"
				label="Reject SFX"
				onClick={(e) => handleStatusChange(e, DiffStatus.REJECTED)}
				icon={<X size={16} />}
			/>
		</div>
	)
}
