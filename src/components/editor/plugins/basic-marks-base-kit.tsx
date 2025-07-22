import {
	BaseBoldPlugin,
	BaseCodePlugin,
	BaseHighlightPlugin,
	BaseItalicPlugin,
	BaseKbdPlugin,
	BaseStrikethroughPlugin,
	BaseSubscriptPlugin,
	BaseSuperscriptPlugin,
	BaseUnderlinePlugin,
} from '@platejs/basic-nodes'

import { CodeLeafStatic } from '@/components/plate-ui-v2/code-node-static'
import { HighlightLeafStatic } from '@/components/plate-ui-v2/highlight-node-static'
import { KbdLeafStatic } from '@/components/plate-ui-v2/kbd-node-static'

export const BaseBasicMarksKit = [
	BaseBoldPlugin,
	BaseItalicPlugin,
	BaseUnderlinePlugin,
	BaseCodePlugin.withComponent(CodeLeafStatic),
	BaseStrikethroughPlugin,
	BaseSubscriptPlugin,
	BaseSuperscriptPlugin,
	BaseHighlightPlugin.withComponent(HighlightLeafStatic),
	BaseKbdPlugin.withComponent(KbdLeafStatic),
]
