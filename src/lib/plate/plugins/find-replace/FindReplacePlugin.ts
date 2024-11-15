import { createTSlatePlugin, type PluginConfig } from '@udecode/plate-common'

import { decorateFindReplace } from './decorateFindReplace'

export type FindReplaceConfig = PluginConfig<
	'search_highlight',
	{
		replace?: string
		replaceEnabled?: boolean
		search?: string
	}
>

export const FindReplacePlugin = createTSlatePlugin<FindReplaceConfig>({
	key: 'search_highlight',
	decorate: decorateFindReplace,
	node: { isLeaf: true },
	options: { search: '', replace: '', replaceEnabled: false },
})
