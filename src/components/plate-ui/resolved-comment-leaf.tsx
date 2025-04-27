'use client'

import React from 'react'
import { cn } from '@udecode/cn'
import type { TCommentText } from '@udecode/plate-comments'
import { PlateLeaf, type PlateLeafProps } from '@udecode/plate-common/react'

import useResolvedComments from '@/lib/plate/plugins/resolved-comments/use-resolved-comments'
import { getResolvedCommentNodeKey } from '@/lib/utils/plate'

export function ResolvedCommentLeaf({
	className,
	...props
}: PlateLeafProps<TCommentText>) {
	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
	const { children, leaf, nodeProps } = props

	const id = getResolvedCommentNodeKey(leaf)
	const { isActive } = useResolvedComments()

	if (!id) {
		return null
	}

	return (
		<PlateLeaf
			id={`resolved-comment-leaf-${id}`}
			{...props}
			className={cn(
				isActive(id) && 'border-b-2 border-b-yellow-400/80 bg-yellow-400/60',
				className
			)}
			nodeProps={{
				...nodeProps,
			}}
		>
			{children}
		</PlateLeaf>
	)
}
