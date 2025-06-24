'use client'

import React from 'react'
import { AI_USER_ID } from '@/constants/ai-constants'
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
	const { comments, set } = useComments()
	const { store, setSidebar, setResolved } = usePlateStore()
	const sidebar = store((state) => state.sidebar)
	const state = useCommentLeafState({ leaf })
	const { props: rootProps } = useCommentLeaf(state)

	const isActive = sidebar === ESidebar.COMMENTS && state.isActive

	const comment = comments.find((item) => item.id === state.lastCommentId)

	const isAi = comment?.userId === AI_USER_ID

	if (!state.commentCount) {
		return children as React.ReactNode
	}

	let aboveChildren = children as React.ReactNode

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
				'border-fm-emerald-400/50 bg-fm-emerald-200/50 hover:border-fm-emerald-400 hover:bg-fm-emerald-200 border-b-1',
				{
					'border-fm-hotpink-400/50 bg-fm-hotpink-200/50 hover:border-fm-hotpink-400 hover:bg-fm-hotpink-200':
						isAi,
					'border-fm-hotpink-400 bg-fm-hotpink-400 hover:border-fm-hotpink-400 hover:bg-fm-hotpink-400 text-fm-hotpink-50':
						isActive && isAi,
					'border-fm-emerald-400 bg-fm-emerald-400 hover:border-fm-emerald-400 hover:bg-fm-emerald-400 text-fm-emerald-50':
						isActive && !isAi,
				},
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
