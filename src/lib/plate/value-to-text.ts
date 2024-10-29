import { Value } from '@udecode/plate-common'

export const valueToText = (value: Value) => {
	return value
		.map((node) => node.children.map((leaf) => leaf.text).join(' '))
		.join('\n')
}
