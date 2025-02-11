'use client'

import React from 'react'
import useComments from '@/hooks/plate/use-comments'
import usePlateStore from '@/store/plate-store'
import { cn } from '@udecode/cn'
import type { TCommentText } from '@udecode/plate-comments'
import {
	useCommentLeaf,
	useCommentLeafState,
} from '@udecode/plate-comments/react'
import { PlateLeaf, type PlateLeafProps } from '@udecode/plate-common/react'

import { ESidebar } from '@/types/plate-types'

export function CommentLeaf({
	className,
	...props
}: PlateLeafProps<TCommentText>) {
	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
	const { children, leaf, nodeProps } = props
	const { set } = useComments()
	const { store, setSidebar, setResolved } = usePlateStore()
	const sidebar = store((state) => state.sidebar)
	const state = useCommentLeafState({ leaf })
	const { props: rootProps } = useCommentLeaf(state)

	const isActive = sidebar === ESidebar.COMMENTS && state.isActive

	if (!state.commentCount) return <>{children}</>

	let aboveChildren = <>{children}</>

	if (!isActive) {
		for (let i = 1; i < state.commentCount; i++) {
			aboveChildren = <span className="bg-primary/20">{aboveChildren}</span>
		}
	}

	return (
		<PlateLeaf
			id={`comment-leaf-${state.lastCommentId}`}
			{...props}
			className={cn(
				'border-b-2 border-b-primary/40 hover:bg-primary/40',
				isActive ? 'bg-primary/40' : 'bg-primary/20',
				className
			)}
			nodeProps={{
				...rootProps,
				...nodeProps,
			}}
			onMouseDown={(e) => {
				setSidebar(ESidebar.COMMENTS)
				setResolved(false)
				set({ activeCommentId: state.lastCommentId })
				props.onClick?.(e)
			}}
		>
			{aboveChildren}
		</PlateLeaf>
	)
}
