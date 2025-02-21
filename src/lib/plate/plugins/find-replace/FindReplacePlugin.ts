import { createTSlatePlugin, type PluginConfig } from '@udecode/plate-common'

import { decorateFindReplace } from '@/lib/plate/plugins/find-replace/decorateFindReplace'

export type FindReplaceConfig = PluginConfig<
	'search_highlight',
	{
		caseSensitive?: boolean
		currentId?: number[]
		replace?: string
		replaceEnabled?: boolean
		search?: string
		wholeWord?: boolean
	}
>

export const FindReplacePlugin = createTSlatePlugin<FindReplaceConfig>({
	key: 'search_highlight',
	decorate: decorateFindReplace,
	node: { isLeaf: true },
	options: {
		search: '',
		replace: '',
		replaceEnabled: false,
		currentId: [0, 0, 0],
		caseSensitive: true,
		wholeWord: true,
	},
})
