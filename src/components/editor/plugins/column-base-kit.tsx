import { BaseColumnItemPlugin, BaseColumnPlugin } from '@platejs/layout'

import {
	ColumnElementStatic,
	ColumnGroupElementStatic,
} from '@/components/plate-ui-v2/column-node-static'

export const BaseColumnKit = [
	BaseColumnPlugin.withComponent(ColumnGroupElementStatic),
	BaseColumnItemPlugin.withComponent(ColumnElementStatic),
]
