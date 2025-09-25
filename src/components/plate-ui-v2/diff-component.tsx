import React, { useMemo } from 'react'
import { AiDiffOperation, DiffStatus } from '@/constants/ai-constants'
import usePlateStore from '@/store/plate-store'
import { DiffOperation } from '@platejs/diff'
import { useShallow } from 'zustand/react/shallow'

import { If } from '@/components/if-else'
import DiffControls, {
	DiffControlsProps,
} from '@/components/plate-ui-v2/diff-controls'
import { cn } from '@/lib/aural-ui/utils'
import {
	describeUpdate,
	diffOperationClassnames,
	diffOperationComponents,
} from '@/lib/plate/diff-helpers'
import { getDiffLeafID } from '@/lib/utils/plate'

interface DiffComponentProps extends DiffControlsProps {
	children: React.ReactNode
	isLeaf?: boolean
	readonly?: boolean
}
export default function DiffComponent({
	element,
	readonly,
	isLeaf = true,
	children,
	editor,
}: DiffComponentProps) {
	const { diffOperation, status } = useMemo(() => {
		return {
			diffOperation: element.diffOperation as DiffOperation,
			status: element.status as DiffStatus,
		}
	}, [element])

	const Component = useMemo(() => {
		if (!isLeaf) {
			return 'div'
		}
		return diffOperationComponents[diffOperation?.type] || 'span'
	}, [isLeaf, diffOperation])

	const NonDiffComponent: keyof JSX.IntrinsicElements = useMemo(() => {
		return isLeaf ? 'span' : 'div'
	}, [isLeaf])

	const { store, setActiveDiffId } = usePlateStore()
	const activeStoreId = store(useShallow((state) => state.activeDiffId))
	const disableDiffAcceptReject = store(
		useShallow((state) => state.disableDiffAcceptReject)
	)

	const activeDiffId = useMemo(() => {
		if (readonly || disableDiffAcceptReject) {
			return null
		}
		return activeStoreId
	}, [activeStoreId, readonly, disableDiffAcceptReject])

	const isActive = useMemo(() => {
		return activeDiffId === element.diff_id
	}, [activeDiffId, element])

	const show = useMemo(() => {
		return (
			(status === DiffStatus.ACCEPTED &&
				diffOperation.type === AiDiffOperation.INSERT) ||
			(status === DiffStatus.REJECTED &&
				diffOperation.type === AiDiffOperation.DELETE) ||
			diffOperation.type === AiDiffOperation.UPDATE
		)
	}, [status, diffOperation])

	if (status !== DiffStatus.PENDING) {
		if (show) {
			return <NonDiffComponent>{children}</NonDiffComponent>
		}
		return null
	}

	return (
		<Component
			className={cn(diffOperationClassnames[diffOperation?.type], 'relative')}
			title={
				diffOperation?.type === AiDiffOperation.UPDATE
					? describeUpdate(diffOperation)
					: undefined
			}
			id={getDiffLeafID(String(element.diff_id))}
			onClick={() => {
				if (readonly) {
					return
				}
				setActiveDiffId(String(element.diff_id))
			}}
		>
			<If condition={isActive}>
				<DiffControls editor={editor} element={element} />
			</If>
			{children}
		</Component>
	)
}
