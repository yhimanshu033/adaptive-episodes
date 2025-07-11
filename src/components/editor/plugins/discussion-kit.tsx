'use client'

import { SuggestionUser } from '@platejs/suggestion'
import { createPlatePlugin } from 'platejs/react'

import { BlockDiscussion } from '@/components/plate-ui-v2/block-discussion'
import { TComment } from '@/components/plate-ui-v2/comment'

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
		users: {} as Record<string, SuggestionUser>,
	},
})
	.configure({
		render: { aboveNodes: BlockDiscussion },
	})
	.extendSelectors(({ getOption }) => ({
		currentUser: () => getOption('users')[getOption('currentUserId')],
		user: (id: string) => getOption('users')[id],
	}))

export const DiscussionKit = [discussionPlugin]
