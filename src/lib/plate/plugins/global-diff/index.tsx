import React from 'react'
import { cn } from '@udecode/cn'
import { BoldPlugin, ItalicPlugin } from '@udecode/plate-basic-marks/react'
import { SoftBreakPlugin } from '@udecode/plate-break/react'
import { createSlatePlugin, isInline, type Value } from '@udecode/plate-common'
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
	withGetFragmentExcludeDiff,
	type DiffOperation,
	type DiffUpdate,
} from '@udecode/plate-diff'
import { cloneDeep } from 'lodash'

const diffOperationColors: Record<DiffOperation['type'], string> = {
	delete: 'bg-red-500/40',
	insert: 'bg-green-500/40',
	update: 'bg-blue-500/40',
}

const describeUpdate = ({ newProperties, properties }: DiffUpdate) => {
	const addedProps: string[] = []
	const removedProps: string[] = []
	const updatedProps: string[] = []

	Object.keys(newProperties).forEach((key) => {
		const oldValue = properties[key] as string
		const newValue = newProperties[key] as string

		if (oldValue === undefined) {
			addedProps.push(key)
			return
		}
		if (newValue === undefined) {
			removedProps.push(key)
			return
		}
		updatedProps.push(key)
	})

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
						delete: 'deletion',
						insert: 'insertion',
						update: 'update',
					}[diffOperation.type]

					const Component = isInline(editor, element) ? 'span' : 'div'

					return (
						<Component
							className={diffOperationColors[diffOperation.type]}
							title={
								diffOperation.type === 'update'
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
	const diffOperation = props.leaf.diffOperation as DiffOperation
	const Component = {
		delete: 'del',
		insert: 'ins',
		update: 'span',
	}[diffOperation.type] as keyof JSX.IntrinsicElements

	return (
		<PlateLeaf {...props} asChild>
			<Component
				className={diffOperationColors[diffOperation.type]}
				title={
					diffOperation.type === 'update'
						? describeUpdate(diffOperation)
						: undefined
				}
			>
				{children}
			</Component>
		</PlateLeaf>
	)
}

export interface DiffViewProps {
	className?: string
	current: Value | null
	plugins?: typeof defaultPlugins
	previous: Value | null
}

const defaultPlugins = [BoldPlugin, ItalicPlugin, DiffPlugin, SoftBreakPlugin]

export function DiffView({
	current,
	previous,
	plugins = defaultPlugins,
	className,
}: DiffViewProps) {
	const diffValue = React.useMemo(() => {
		const editor = createPlateEditor({
			plugins,
		})
		if (!previous || !current) return
		return computeDiff(previous, cloneDeep(current), {
			isInline: editor.isInline,
			lineBreakChar: '¶',
		}) as Value
	}, [previous, current, plugins])

	const editor = usePlateEditor(
		{
			plugins,
			value: diffValue,
		},
		[diffValue]
	)

	return (
		previous &&
		current && (
			<Plate editor={editor} readOnly>
				<PlateContent className={cn('rounded-md border p-3', className)} />
			</Plate>
		)
	)
}

export default DiffView
