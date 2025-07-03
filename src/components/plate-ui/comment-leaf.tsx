'use client'

import React, { useCallback, useMemo } from 'react'
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

export const CommentLeaf = React.memo(function CommentLeaf({
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

	// Memoize expensive computations
	const isActive = useMemo(
		() => sidebar === ESidebar.COMMENTS && state.isActive,
		[sidebar, state.isActive]
	)

	const comment = useMemo(
		() => comments.find((item) => item.id === state.lastCommentId),
		[comments, state.lastCommentId]
	)

	const isAi = useMemo(() => comment?.userId === AI_USER_ID, [comment?.userId])

	// Memoize the nested spans creation
	const aboveChildren = useMemo(() => {
		if (!state.commentCount) {
			return children as React.ReactNode
		}

		if (isActive || state.commentCount <= 1) {
			return children as React.ReactNode
		}

		let result = children as React.ReactNode
		for (let i = 1; i < state.commentCount; i++) {
			result = <span className="bg-primary/20">{result}</span>
		}
		return result
	}, [children, state.commentCount, isActive])

	// Memoize className computation
	const computedClassName = useMemo(() => {
		return cn(
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
		)
	}, [isAi, isActive, className])

	// Memoize combined nodeProps
	const combinedNodeProps = useMemo(
		() => ({ ...rootProps, ...nodeProps }),
		[rootProps, nodeProps]
	)

	// Memoize mouse down handler
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

	// Early return for no comments
	if (!state.commentCount) {
		return children as React.ReactNode
	}

	return (
		<PlateLeaf
			id={`comment-leaf-${state.lastCommentId}`}
			{...props}
			className={computedClassName}
			nodeProps={combinedNodeProps}
			onMouseDown={handleMouseDown}
		>
			{aboveChildren}
		</PlateLeaf>
	)
})
