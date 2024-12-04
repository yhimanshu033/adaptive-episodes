'use client'

import React from 'react'
import useComments from '@/hooks/plate/use-comments'
import usePlateStore, { setSidebar } from '@/store/plate-store'
import { cn } from '@udecode/cn'
import type { TCommentText } from '@udecode/plate-comments'
import {
	useCommentLeaf,
	useCommentLeafState,
} from '@udecode/plate-comments/react'
import { PlateLeaf, type PlateLeafProps } from '@udecode/plate-common/react'

export function CommentLeaf({
	className,
	...props
}: PlateLeafProps<TCommentText>) {
	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
	const { children, leaf, nodeProps } = props
	const { isCommented, set } = useComments()
	const sidebar = usePlateStore((state) => state.sidebar)
	const state = useCommentLeafState({ leaf })
	const { props: rootProps } = useCommentLeaf(state)

	const active =
		isCommented(state.lastCommentId) ||
		(sidebar === 'comments' && state.isActive)

	if (!state.commentCount || !active) return <>{children}</>

	let aboveChildren = <>{children}</>

	if (!active) {
		for (let i = 1; i < state.commentCount; i++) {
			aboveChildren = <span className="bg-primary/20">{aboveChildren}</span>
		}
	}

	return (
		<PlateLeaf
			{...props}
			className={cn(
				'border-b-2 border-b-primary/40',
				active ? 'bg-primary/40' : 'bg-primary/20',
				className
			)}
			nodeProps={{
				...rootProps,
				...nodeProps,
			}}
			onMouseDown={(e) => {
				setSidebar('comments')
				set({ activeCommentId: state.lastCommentId })
				props.onClick?.(e)
			}}
		>
			{aboveChildren}
		</PlateLeaf>
	)
}
