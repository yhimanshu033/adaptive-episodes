import {
	BaseBoldPlugin,
	BaseHighlightPlugin,
	BaseItalicPlugin,
	BaseUnderlinePlugin,
} from '@platejs/basic-nodes'

import { HighlightLeafStatic } from '@/components/plate-ui-v2/highlight-node-static'

export const BaseBasicMarksKit = [
	BaseBoldPlugin,
	BaseItalicPlugin,
	BaseUnderlinePlugin,
	BaseHighlightPlugin.withComponent(HighlightLeafStatic),
]
