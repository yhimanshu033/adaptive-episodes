'use client'

import React from 'react'
import usePlateStore from '@/store/plate-store'
import {
	PlateLeaf,
	PlateLeafProps,
	useEditorPlugin,
} from '@udecode/plate-common/react'

import { FindReplacePlugin } from '@/lib/plate/plugins/find-replace'
import { cn } from '@/lib/utils'

function isCurrent(arr1: number[], arr2: number[]) {
	return arr1.every((v, i) => v === arr2[i])
}
export const SearchHighlightLeaf = ({
	className,
	...props
}: PlateLeafProps) => {
	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
	const { children, leaf } = props
	const sidebar = usePlateStore((state) => state.sidebar)
	const { useOption, setOption } = useEditorPlugin(FindReplacePlugin)
	const replaceWith = useOption('replace')
	const replaceEnabled = useOption('replaceEnabled')
	const currentId = useOption('currentId') || [0, 0, 0]
	const id = leaf.id as number[]
	function setCurrent() {
		setOption('currentId', id)
	}
	function renderContent() {
		if (isCurrent(id, currentId) && replaceEnabled) {
			return (
				<>
					<del className="bg-red-500/60">{children}</del>
					<span className="bg-blue-500/60">{replaceWith}</span>
				</>
			)
		} else if (isCurrent(id, currentId)) {
			return <span className="bg-yellow-500/60">{children}</span>
		} else {
			return <span className="bg-green-500/60">{children}</span>
		}
	}
	return sidebar === 'far' ? (
		<PlateLeaf
			onClick={setCurrent}
			id={`search-highlight-${id.join('-')}`}
			{...props}
			className={cn(className)}
		>
			{renderContent()}
		</PlateLeaf>
	) : (
		<>{children}</>
	)
}
