/* eslint-disable @typescript-eslint/no-unsafe-assignment */
'use client'

import * as React from 'react'
import { AI_USER_ID } from '@/constants/ai-constants'
import type { TCommentText } from 'platejs'
import type { PlateLeafProps } from 'platejs/react'
import { PlateLeaf, useEditorPlugin, usePluginOption } from 'platejs/react'

import { commentPlugin } from '@/components/editor/plugins/comment-kit'
import { cn } from '@/lib/utils/helpers'

import { discussionPlugin } from '../editor/plugins/discussion-kit'

export function CommentLeaf(props: PlateLeafProps<TCommentText>) {
	const { children, leaf } = props

	const { api, setOption } = useEditorPlugin(commentPlugin)
	const activeId = usePluginOption(commentPlugin, 'activeId')
	const discussions = useEditorPlugin(discussionPlugin).getOption('discussions')

	const currentId = api.comment.nodeId(leaf)
	const isActive = activeId === currentId

	const userId =
		discussions.find((item) => item.id === currentId)?.userId ?? null

	const isAi = userId === AI_USER_ID

	return (
		<PlateLeaf
			className={cn(
				'border-fm-emerald-400/50 bg-fm-emerald-200/50 hover:border-fm-emerald-400 hover:bg-fm-emerald-200 border-b-1',
				{
					'border-fm-hotpink-400/50 bg-fm-hotpink-200/50 hover:border-fm-hotpink-400 hover:bg-fm-hotpink-200':
						isAi,
					'border-fm-hotpink-400 bg-fm-hotpink-400 hover:border-fm-hotpink-400 hover:bg-fm-hotpink-400 text-fm-hotpink-50':
						isActive && isAi,
					'border-fm-emerald-400 bg-fm-emerald-400 hover:border-fm-emerald-400 hover:bg-fm-emerald-400 text-fm-emerald-50':
						isActive && !isAi,
				}
			)}
			{...props}
			attributes={{
				...props.attributes,
				id: `comment-leaf-${currentId}`,
				onClick: () => setOption('activeId', currentId ?? null),
				onMouseEnter: () => setOption('hoverId', currentId ?? null),
				onMouseLeave: () => setOption('hoverId', null),
			}}
		>
			{children}
		</PlateLeaf>
	)
}
