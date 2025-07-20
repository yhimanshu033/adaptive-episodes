'use client'

import { nanoid, Value } from 'platejs'
import { createPlatePlugin } from 'platejs/react'

import { BlockDiscussion } from '@/components/plate-ui-v2/block-discussion'
import { TComment } from '@/components/plate-ui-v2/comment'

import { PlateUser } from '@/types/plate-types'

export interface TDiscussion {
	comments: TComment[]
	createdAt: Date
	documentContent?: string
	id: string
	isResolved: boolean
	userId: string
}

// This plugin is purely UI. It's only used to store the discussions and users data
export const discussionPlugin = createPlatePlugin({
	key: 'discussion',
	options: {
		currentUserId: '1',
		discussions: [] as TDiscussion[],
		users: {} as Record<string, PlateUser>,
	},
})
	.extendSelectors(({ getOption }) => ({
		currentUser: () => getOption('users')[getOption('currentUserId')],
		user: (id: string) => getOption('users')[id],
	}))
	.extendApi(({ getOption, setOption }) => ({
		addToReplies: (
			discussionId: string,
			commentValue: Value,
			userID?: string
		) => {
			const comment: TComment = {
				id: nanoid(),
				contentRich: commentValue,
				createdAt: new Date(),
				discussionId,
				isEdited: false,
				userId: userID ?? getOption('currentUserId'),
			}
			const discussions = getOption('discussions')
			const discussion = discussions.find((d) => d.id === discussionId)
			if (!discussion) {
				return
			}
			const updatedDiscussion = {
				...discussion,
				comments: [...discussion.comments, comment],
			}

			const updatedDiscussions = discussions
				.filter((d) => d.id !== discussionId)
				.concat(updatedDiscussion)

			setOption('discussions', updatedDiscussions)
		},
	}))

export const DiscussionKit = [discussionPlugin]
