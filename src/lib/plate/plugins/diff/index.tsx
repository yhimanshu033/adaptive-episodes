/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import React, { useCallback, useEffect } from 'react'
import { AiDiffOperation, DiffStatus } from '@/constants/ai-constants'
import useAIStore from '@/store/ai-store'
import usePlateStore from '@/store/plate-store'
import { cn } from '@udecode/cn'
import { BoldPlugin, ItalicPlugin } from '@udecode/plate-basic-marks/react'
import { SoftBreakPlugin } from '@udecode/plate-break/react'
import {
	createSlatePlugin,
	isInline,
	nanoid,
	TDescendant,
	type Value,
} from '@udecode/plate-common'
import {
	createPlateEditor,
	Plate,
	PlateContent,
	PlateLeaf,
	toPlatePlugin,
	usePlateEditor,
	type PlateLeafProps,
} from '@udecode/plate-common/react'
import {
	computeDiff,
	DiffProps as LegacyDiffProps,
	withGetFragmentExcludeDiff,
	type DiffOperation,
	type DiffUpdate,
} from '@udecode/plate-diff'
import { Check, X } from 'lucide-react'

import { Button } from '@/components/ui/button'

import { ESidebar } from '@/types/plate-types'

const diffOperationColors: Record<DiffOperation['type'], string> = {
	[AiDiffOperation.DELETE]: 'bg-red-500/40',
	[AiDiffOperation.INSERT]: 'bg-green-500/40',
	[AiDiffOperation.UPDATE]: 'bg-blue-500/40',
}

const describeUpdate = ({ newProperties, properties }: DiffUpdate) => {
	const { addedProps, removedProps, updatedProps } = Object.entries(
		newProperties
	).reduce(
		(
			acc: {
				addedProps: string[]
				removedProps: string[]
				updatedProps: string[]
			},
			[key, newValue]
		) => {
			const oldValue = properties[key] as string

			if (oldValue === undefined) {
				acc.addedProps.push(key)
			}
			if (newValue === undefined) {
				acc.removedProps.push(key)
			}
			acc.updatedProps.push(key)
			return acc
		},
		{ addedProps: [], removedProps: [], updatedProps: [] }
	)

	const descriptionParts = []
	if (addedProps.length > 0)
		descriptionParts.push(`Added ${addedProps.join(', ')}`)
	if (removedProps.length > 0)
		descriptionParts.push(`Removed ${removedProps.join(', ')}`)
	if (updatedProps.length > 0) {
		updatedProps.forEach((key) => {
			descriptionParts.push(
				`Updated ${key} from ${properties[key]} to ${newProperties[key]}`
			)
		})
	}

	return descriptionParts.join('\n')
}

export const DiffPlugin = toPlatePlugin(
	createSlatePlugin({
		key: 'diff',
		extendEditor: withGetFragmentExcludeDiff,
		node: { isLeaf: true },
	}),
	{
		render: {
			aboveNodes:
				() =>
				({ children, editor, element }) => {
					if (!element.diff) return children as React.ReactNode

					const diffOperation = element.diffOperation as DiffOperation
					const label = {
						[AiDiffOperation.DELETE]: 'deletion',
						[AiDiffOperation.INSERT]: 'insertion',
						[AiDiffOperation.UPDATE]: 'update',
					}[diffOperation?.type]

					const Component = isInline(editor, element) ? 'span' : 'div'

					return (
						<Component
							className={diffOperationColors[diffOperation?.type]}
							title={
								diffOperation?.type === AiDiffOperation.UPDATE
									? describeUpdate(diffOperation)
									: undefined
							}
							aria-label={label}
						>
							{children}
						</Component>
					)
				},
			node: DiffLeaf,
		},
	}
)

function DiffLeaf({ children, ...props }: PlateLeafProps) {
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
	const localDiffValue = store((state) => state.localDiffValue)
	const sidebar = store((state) => state.sidebar)
	const isLocalDiff = sidebar === ESidebar.LOCAL_DIFF && !!localDiffValue
	const activeDiffId = isLocalDiff ? null : store((state) => state.activeDiffId)

	const handleStatusChange = useCallback(
		(status: DiffStatus) => {
			function findNode(node: TDescendant) {
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

	const status = leaf.status
	const operation = leaf.diffOperation.type
	const isActive = activeDiffId === leaf.diff_id
	const show =
		(status === DiffStatus.ACCEPTED && operation === AiDiffOperation.INSERT) ||
		(status === DiffStatus.REJECTED && operation === AiDiffOperation.DELETE) ||
		operation === AiDiffOperation.UPDATE
	return (
		<PlateLeaf
			onClick={() => {
				if (isLocalDiff) return
				setActiveDiffId(leaf.diff_id)
			}}
			{...props}
			asChild
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
						<div className="absolute bottom-0 z-50 flex translate-y-full gap-2 rounded-md p-1">
							<Button
								variant="outline"
								size="sm"
								onClick={() => handleStatusChange(DiffStatus.ACCEPTED)}
							>
								<Check size={16} />
							</Button>
							<Button
								variant="outline"
								size="sm"
								onClick={() => handleStatusChange(DiffStatus.REJECTED)}
							>
								<X size={16} />
							</Button>
						</div>
					)}
					{children}
				</Component>
			) : (
				show && <>{children}</>
			)}
		</PlateLeaf>
	)
}

export interface DiffViewProps {
	className?: string
	current: Value | null
	plugins?: typeof defaultPlugins
	previous: Value | null
}

export interface DiffProps extends LegacyDiffProps {
	diff_id: string
	status: DiffStatus
}

const defaultPlugins = [BoldPlugin, ItalicPlugin, DiffPlugin, SoftBreakPlugin]

const getInsertProps = (): DiffProps => {
	return {
		diff: true,
		diffOperation: {
			type: AiDiffOperation.INSERT,
		},
		diff_id: nanoid(),
		status: DiffStatus.PENDING,
	}
}

export const getDeleteProps = (): DiffProps => ({
	diff: true,
	diffOperation: {
		type: AiDiffOperation.DELETE,
	},
	diff_id: nanoid(),
	status: DiffStatus.PENDING,
})

export const getUpdateProps = (
	_node: TDescendant,
	properties: any,
	newProperties: any
): DiffProps => ({
	diff: true,
	diffOperation: {
		newProperties,
		properties,
		type: AiDiffOperation.UPDATE,
	},
	diff_id: nanoid(),
	status: DiffStatus.PENDING,
})
export const useDiffEditor = ({
	current,
	previous,
	plugins = defaultPlugins,
}: DiffViewProps) => {
	const diffValue = React.useMemo(() => {
		const editor = createPlateEditor({
			plugins,
			id: 'diff-editor',
		})
		if (!previous || !current) return []
		return computeDiff(structuredClone(previous), structuredClone(current), {
			isInline: editor.isInline,
			getInsertProps,
			getDeleteProps,
			getUpdateProps,
		}) as Value
	}, [previous, current, plugins])
	const { setAcceptedValue } = useAIStore()

	useEffect(() => {
		setAcceptedValue(diffValue)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [diffValue])

	const editor = usePlateEditor(
		{
			plugins,
			value: diffValue,
		},
		[diffValue]
	)

	return editor
}

export function DiffView({
	current,
	previous,
	plugins = defaultPlugins,
	className,
}: DiffViewProps) {
	const editor = useDiffEditor({ current, previous, plugins })

	if (!previous || !current) return null
	return (
		<Plate editor={editor} readOnly>
			<PlateContent className={cn('rounded-md border p-3', className)} />
		</Plate>
	)
}

export default DiffView
