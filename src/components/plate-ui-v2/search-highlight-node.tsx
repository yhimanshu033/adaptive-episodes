'use client'

import React, { useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import { GLOBAL_LOCALIZE } from '@/constants/global-constants'
import usePlateStore from '@/store/plate-store'
import {
	PlateLeaf,
	PlateLeafProps,
	useEditorPlugin,
	usePluginOption,
} from 'platejs/react'

import useEpisodeId from '@/providers/episode-id-provider'
import { FindReplacePlugin } from '@/lib/plate/plugins/find-replace'
import { cn, isArrayEqual } from '@/lib/utils/helpers'

import { ESidebar } from '@/types/plate-types'

export const SearchHighlightLeaf = ({
	className,
	...props
}: PlateLeafProps) => {
	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
	const { children, leaf } = props
	const { store } = usePlateStore()
	const sidebar = store((state) => state.sidebar)
	const { setOption } = useEditorPlugin(FindReplacePlugin)
	const replaceEnabled = usePluginOption(FindReplacePlugin, 'replaceEnabled')
	const currentId = usePluginOption(FindReplacePlugin, 'currentId') || [0, 0, 0]
	const id = leaf.id as number[]

	const episodeId = useEpisodeId()
	const globalLocalize = useSearchParams().get(GLOBAL_LOCALIZE)

	const elemId = useMemo(() => {
		if (!globalLocalize) {
			return `search-highlight-${id.join('-')}`
		}
		return `search-highlight-${episodeId}-${id.join('-')}`
	}, [episodeId, id, globalLocalize])

	function setCurrent() {
		setOption('currentId', id)
		if (!globalLocalize) {
			return
		}
	}
	function renderContent() {
		if (isArrayEqual(id, currentId) && replaceEnabled) {
			return (
				<span className="bg-fm-surface-positive text-fm-contrast">
					{children}
				</span>
			)
		} else if (isArrayEqual(id, currentId)) {
			return (
				<span className="bg-fm-surface-positive text-fm-contrast">
					{children}
				</span>
			)
		} else {
			return (
				<span className="bg-fm-surface-positive/30 border-fm-divider-positive border-b">
					{children}
				</span>
			)
		}
	}
	return sidebar === ESidebar.FAR || !!globalLocalize ? (
		<PlateLeaf
			{...props}
			className={cn(className)}
			attributes={{
				'data-testid': elemId,
				onClick: setCurrent,
				id: elemId,
			}}
		>
			{renderContent()}
		</PlateLeaf>
	) : (
		<>{children}</>
	)
}
