import { TDescendant } from '@udecode/plate-common'

export type Selection = {
	anchor: {
		offset: number
		path: [number, number]
	}
	focus: {
		offset: number
		path: [number, number]
	}
}

export type Child = {
	id: string
	text: string
}

export type Block = {
	children: Child[]
	type: string
}

export type Node = {
	children: Block[]
}

export type TLaserLeafChildren = {
	props: {
		parent: {
			children: TDescendant[]
		}
	}
}
