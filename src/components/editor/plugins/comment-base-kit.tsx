import { BaseCommentPlugin } from '@platejs/comment'

import { CommentLeafStatic } from '@/components/plate-ui-v2/comment-node-static'

export const BaseCommentKit = [
	BaseCommentPlugin.withComponent(CommentLeafStatic),
]
