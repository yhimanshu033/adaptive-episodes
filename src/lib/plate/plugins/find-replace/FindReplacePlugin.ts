import { INITIAL_FAR_OPTIONS } from '@/constants/ai-constants'
import { createTSlatePlugin, KEYS, type PluginConfig } from 'platejs'

import { decorateFindReplace } from '@/lib/plate/plugins/find-replace/decorateFindReplace'

export type FindReplaceConfig = PluginConfig<
	'search_highlight',
	{
		caseSensitive?: boolean
		currentId?: number[]
		genitive?: boolean
		replace?: string
		replaceEnabled?: boolean
		search?: string
		wholeWord?: boolean
	}
>

export const FindReplacePlugin = createTSlatePlugin<FindReplaceConfig>({
	key: KEYS.searchHighlight,
	decorate: decorateFindReplace,
	node: { isLeaf: true },
	options: INITIAL_FAR_OPTIONS,
})
