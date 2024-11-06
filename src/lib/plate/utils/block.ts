import { Selection } from '../types/block'

export function isSameBlock(selection: Selection): boolean {
	return selection.anchor.path[0] === selection.focus.path[0]
}

export function isSameChild(selection: Selection): boolean {
	return selection.anchor.path[1] === selection.focus.path[1]
}

export function getBlockDistance(selection: Selection): number {
	return Math.abs(selection.anchor.path[0] - selection.focus.path[0])
}

export function getStartAndEnd(selection: Selection) {
	const start = isSameBlock(selection)
		? isSameChild(selection)
			? selection.anchor.offset < selection.focus.offset
				? selection.anchor
				: selection.focus
			: selection.anchor.path[1] < selection.focus.path[1]
				? selection.anchor
				: selection.focus
		: selection.anchor.path[0] < selection.focus.path[0]
			? selection.anchor
			: selection.focus

	const end = isSameBlock(selection)
		? isSameChild(selection)
			? selection.anchor.offset < selection.focus.offset
				? selection.focus
				: selection.anchor
			: selection.anchor.path[1] < selection.focus.path[1]
				? selection.focus
				: selection.anchor
		: selection.anchor.path[0] < selection.focus.path[0]
			? selection.focus
			: selection.anchor

	return { start, end }
}
