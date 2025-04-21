'use client'

import React, { useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import { GLOBAL_LOCALIZE } from '@/constants/global-constants'
import useGlobalFindAndReplace from '@/hooks/use-global-find-and-replace'
import usePlateStore from '@/store/plate-store'
import {
	PlateLeaf,
	PlateLeafProps,
	useEditorPlugin,
} from '@udecode/plate-common/react'

import useEpisodeId from '@/providers/episode-id-provider'
import { FindReplacePlugin } from '@/lib/plate/plugins/find-replace'
import { cn } from '@/lib/utils/helpers'

import { ESidebar } from '@/types/plate-types'

function isCurrent(arr1: number[], arr2: number[]) {
	return arr1.every((v, i) => v === arr2[i])
}
export const SearchHighlightLeaf = ({
	className,
	...props
}: PlateLeafProps) => {
	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
	const { children, leaf } = props
	const { store } = usePlateStore()
	const sidebar = store((state) => state.sidebar)
	const { useOption, setOption } = useEditorPlugin(FindReplacePlugin)
	const replaceWith = useOption('replace')
	const replaceEnabled = useOption('replaceEnabled')
	const currentId = useOption('currentId') || [0, 0, 0]
	const id = leaf.id as number[]

	const episodeId = useEpisodeId()
	const globalLocalize = useSearchParams().get(GLOBAL_LOCALIZE)
	const { setOptions } = useGlobalFindAndReplace()

	const elemId = useMemo(() => {
		if (!globalLocalize) {
			return `search-highlight-${id.join('-')}`
		}
		return `search-highlight-${episodeId}-${id.join('-')}`
	}, [episodeId, id, globalLocalize])

	function setCurrent() {
		setOption('currentId', id)
		if (!globalLocalize) return
		setOptions({ currentId: id })
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
	return sidebar === ESidebar.FAR || !!globalLocalize ? (
		<PlateLeaf
			onClick={setCurrent}
			id={elemId}
			{...props}
			className={cn(className)}
		>
			{renderContent()}
		</PlateLeaf>
	) : (
		<>{children}</>
	)
}
