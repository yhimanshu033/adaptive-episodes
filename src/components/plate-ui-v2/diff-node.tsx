/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import React, { useCallback } from 'react'
import { AiDiffOperation, DiffStatus } from '@/constants/ai-constants'
import useAIStore from '@/store/ai-store'
import usePlateStore from '@/store/plate-store'
import { DiffOperation } from '@platejs/diff'
import { Check, X } from 'lucide-react'
import { Descendant } from 'platejs'
import { PlateLeaf, PlateLeafProps } from 'platejs/react'

import { cn } from '@/lib/aural-ui/utils'
import { describeUpdate, diffOperationColors } from '@/lib/plate/diff-helpers'

import { Button } from '../aural-ui/button'
import { IconButton } from '../aural-ui/icon-button'

function DiffLeaf({
	children,
	readonly = true,
	...props
}: PlateLeafProps & { readonly?: boolean }) {
	const { setAcceptedValue } = useAIStore()
	const diffOperation = props.leaf.diffOperation as DiffOperation

	const Component = {
		[AiDiffOperation.DELETE]: 'del',
		[AiDiffOperation.INSERT]: 'ins',
		[AiDiffOperation.UPDATE]: 'span',
	}[diffOperation?.type] as keyof JSX.IntrinsicElements

	const leaf: any = props.leaf
	const value = structuredClone(props.editor.children)
	const { store, setActiveDiffId } = usePlateStore()
	const activeDiffId = readonly ? null : store((state) => state.activeDiffId)

	const status = leaf.status
	const operation = leaf.diffOperation.type
	const isActive = activeDiffId === leaf.diff_id
	const show =
		(status === DiffStatus.ACCEPTED && operation === AiDiffOperation.INSERT) ||
		(status === DiffStatus.REJECTED && operation === AiDiffOperation.DELETE) ||
		operation === AiDiffOperation.UPDATE

	const handleStatusChange = useCallback(
		(
			e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
			status: DiffStatus
		) => {
			e.stopPropagation()
			function findNode(node: Descendant) {
				if ('diff' in node) {
					if (node.diff_id === leaf.diff_id) {
						node.status = status
					}
				} else if ('children' in node) {
					;(node.children as any[]).forEach(findNode)
				}
			}
			value.forEach(findNode)
			props.editor.tf.setValue(structuredClone(value))
			setAcceptedValue(structuredClone(value))
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[value, leaf.diff_id, props.editor.tf]
	)

	return (
		<PlateLeaf
			{...props}
			// as={Component}
			attributes={{
				...props.attributes,
				onClick: () => {
					if (readonly) {
						return
					}
					setActiveDiffId(leaf.diff_id)
				},
			}}
		>
			{leaf.status === DiffStatus.PENDING ? (
				<Component
					className={cn(diffOperationColors[diffOperation?.type], 'relative')}
					title={
						diffOperation?.type === AiDiffOperation.UPDATE
							? describeUpdate(diffOperation)
							: undefined
					}
				>
					{isActive && (
						<div className="absolute top-2/5 right-0 flex translate-x-full gap-2 pl-10">
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
					)}
					{children}
				</Component>
			) : (
				show && <p>{children}</p>
			)}
		</PlateLeaf>
	)
}

export default DiffLeaf
