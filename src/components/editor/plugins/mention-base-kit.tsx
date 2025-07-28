import { BaseMentionPlugin } from '@platejs/mention'

import { MentionElementStatic } from '@/components/plate-ui-v2/mention-node-static'

export const BaseMentionKit = [
	BaseMentionPlugin.withComponent(MentionElementStatic),
]
