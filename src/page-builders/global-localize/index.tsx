'use client'

import React from 'react'
import { useParams } from 'next/navigation'
import { EditorExtendedStateProvider } from '@/hooks/use-editor-extend-state'
import { GlobalFindAndReplaceProvider } from '@/hooks/use-global-find-and-replace'

import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from '@/components/ui/resizable'

import EditorArray from './editor-array'
import GlobalLocalize from './sidebar'

export default function MultiEpisodeLocalization() {
	const { episodeId } = useParams()
	return (
		<EditorExtendedStateProvider episodeId={Number(episodeId)}>
			<GlobalFindAndReplaceProvider>
				<ResizablePanelGroup
					direction="horizontal"
					className="flex h-full overflow-visible!"
				>
					<ResizablePanel
						minSize={50}
						order={1}
						className="h-full w-full flex-1 overflow-visible!"
					>
						<EditorArray />
					</ResizablePanel>
					<ResizableHandle />
					<GlobalLocalize />
				</ResizablePanelGroup>
			</GlobalFindAndReplaceProvider>
		</EditorExtendedStateProvider>
	)
}
