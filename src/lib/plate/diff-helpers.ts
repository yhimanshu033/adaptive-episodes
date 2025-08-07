/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { AiDiffOperation, DiffStatus } from '@/constants/ai-constants'
import { DiffOperation, DiffUpdate } from '@platejs/diff'
import { Descendant, nanoid } from 'platejs'

import { DiffProps } from '@/types/plate-types'

export const diffOperationColors: Record<DiffOperation['type'], string> = {
	[AiDiffOperation.DELETE]: 'bg-red-500/40',
	[AiDiffOperation.INSERT]: 'bg-green-500/40',
	[AiDiffOperation.UPDATE]: 'bg-blue-500/40',
}

export const diffOperationClassnames: Record<DiffOperation['type'], string> = {
	[AiDiffOperation.DELETE]: 'bg-red-500/40 line-through',
	[AiDiffOperation.INSERT]: 'bg-green-500/40 underline',
	[AiDiffOperation.UPDATE]: 'bg-blue-500/40',
}

export const diffOperationComponents: Record<
	DiffOperation['type'],
	keyof JSX.IntrinsicElements
> = {
	[AiDiffOperation.DELETE]: 'del',
	[AiDiffOperation.INSERT]: 'ins',
	[AiDiffOperation.UPDATE]: 'span',
}

export const describeUpdate = ({ newProperties, properties }: DiffUpdate) => {
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
	if (addedProps.length > 0) {
		descriptionParts.push(`Added ${addedProps.join(', ')}`)
	}
	if (removedProps.length > 0) {
		descriptionParts.push(`Removed ${removedProps.join(', ')}`)
	}
	if (updatedProps.length > 0) {
		updatedProps.forEach((key) => {
			descriptionParts.push(
				`Updated ${key} from ${properties[key]} to ${newProperties[key]}`
			)
		})
	}
	return descriptionParts.join('\n')
}

export const getInsertProps = (): DiffProps => {
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
	_node: Descendant,
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
