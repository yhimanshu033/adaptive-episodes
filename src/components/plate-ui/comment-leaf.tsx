'use client'

import React, { useCallback, useMemo } from 'react'
import usePlateStore from '@/store/plate-store'
import { cn } from '@udecode/cn'
import type { TCommentText } from '@udecode/plate-comments'
import {
	CommentsPlugin,
	useCommentLeaf,
	useCommentLeafState,
} from '@udecode/plate-comments/react'
import {
	PlateLeaf,
	useEditorPlugin,
	type PlateLeafProps,
} from '@udecode/plate-common/react'

import { ESidebar } from '@/types/plate-types'

export const CommentLeaf = React.memo(function CommentLeaf({
	className,
	...props
}: PlateLeafProps<TCommentText>) {
	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
	const { children, leaf, nodeProps } = props
	const { setOptions: set } = useEditorPlugin(CommentsPlugin)
	const { store, setSidebar, setResolved } = usePlateStore()
	const sidebar = store((state) => state.sidebar)
	const state = useCommentLeafState({ leaf })
	const { props: rootProps } = useCommentLeaf(state)

	// Memoize expensive computations
	const isActive = useMemo(
		() => sidebar === ESidebar.COMMENTS && state.isActive,
		[sidebar, state.isActive]
	)

	const aboveChildren = useMemo(() => {
		if (isActive || state.commentCount <= 1) {
			return children as React.ReactNode
		}

		let result = children as React.ReactNode
		for (let i = 1; i < state.commentCount; i++) {
			result = <span className="bg-primary/20">{result}</span>
		}
		return result
	}, [children, state.commentCount, isActive])

	const handleMouseDown = useCallback(
		(e: React.MouseEvent) => {
			setSidebar(ESidebar.COMMENTS)
			setResolved(false)
			set({ activeCommentId: state.lastCommentId })
			props?.onClick?.(e as React.MouseEvent<HTMLSpanElement, MouseEvent>)
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[setSidebar, setResolved, set, state.lastCommentId, props.onClick]
	)

	const commentClassName = useMemo(
		() =>
			cn(
				'border-b-primary/40 hover:bg-primary/40 border-b-2',
				isActive ? 'bg-primary/40' : 'bg-primary/20',
				className
			),
		[isActive, className]
	)

	// Early return for no comments
	if (!state.commentCount) {
		return children as React.ReactNode
	}

	return (
		<PlateLeaf
			id={`comment-leaf-${state.lastCommentId}`}
			{...props}
			className={commentClassName}
			nodeProps={{
				...rootProps,
				...nodeProps,
			}}
			onMouseDown={handleMouseDown}
		>
			{aboveChildren}
		</PlateLeaf>
	)
})
