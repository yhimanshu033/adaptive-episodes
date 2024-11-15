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

export const SearchHighlightLeaf = ({
	className,
	...props
}: PlateLeafProps) => {
	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
	const { children } = props
	const sidebar = usePlateStore((state) => state.sidebar)
	const { useOption } = useEditorPlugin(FindReplacePlugin)
	const replaceWith = useOption('replace')
	const replaceEnabled = useOption('replaceEnabled')
	return sidebar === 'far' ? (
		<PlateLeaf {...props} className={cn(className)}>
			{replaceEnabled ? (
				<>
					<del className="c bg-red-500/60">{children}</del>
					<span className="bg-blue-500/60">{replaceWith}</span>
				</>
			) : (
				<span className="bg-yellow-500/60">{children}</span>
			)}
		</PlateLeaf>
	) : (
		<>{children}</>
	)
}
