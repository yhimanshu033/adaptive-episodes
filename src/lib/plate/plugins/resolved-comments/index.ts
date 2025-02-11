import { createTSlatePlugin, type PluginConfig } from '@udecode/plate-common'

import { TCustomComment } from '@/types/editor-types'

export type ResolvedCommentsConfig = PluginConfig<
	'resolved_comments',
	{
		activeResolvedCommentId: string | null
		resolvedComments: TCustomComment[]
	}
>

export const ResolvedCommentsPlugin =
	createTSlatePlugin<ResolvedCommentsConfig>({
		key: 'resolved_comments',
		node: { isLeaf: true },
		options: {
			resolvedComments: [],
			activeResolvedCommentId: null,
		},
	})
