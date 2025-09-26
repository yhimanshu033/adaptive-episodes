'use client'

import React from 'react'
import { useSearchParams } from 'next/navigation'
import { MAIN_EDITOR_ID } from '@/constants/editor-constants'
import { SIMPLIFIED_VIEWABLE_EDITOR } from '@/constants/global-constants'
import { EditorDataContextProvider } from '@/hooks/plate/use-editor-data'
import useEpisodeContent from '@/hooks/query/use-episode-content'
import useMyEditor from '@/hooks/use-my-editor'
import { SavingContextProvider } from '@/hooks/use-saving'
import EditorOverlayLoader from '@/page-builders/plate-editor/editor-overlay-loader'
import { EditorSkeletonLoader } from '@/page-builders/plate-editor/editor-skelton-loader'
import { Plate } from 'platejs/react'

import { ScrollArea } from '@/components/aural-ui/scroll-area'
import useProjectId from '@/providers/project-id-provider'
import { cn } from '@/lib/aural-ui/utils'

import { EStatus } from '@/types/common'
import { TGetEpisodeResponse } from '@/types/episode-type'

import EditorHandler from '../plate-editor/editor-handler'
import EpisodeHeader from './episode-header'
import FarConnection from './far-connection'
import SaveContentMap from './save-content-map'

function MyEditor({
	content,
	latestStatus,
}: {
	content: TGetEpisodeResponse
	latestStatus: EStatus | 'BASE'
}) {
	const searchParams = useSearchParams()
	const simplifiedEditor = searchParams.get(SIMPLIFIED_VIEWABLE_EDITOR)

	const editor = useMyEditor({
		content: content.text || '',
		id: MAIN_EDITOR_ID,
		comments: content?.chapter?.props?.comments,
		simplified: !!simplifiedEditor,
	})

	return (
		<Plate editor={editor}>
			<EditorDataContextProvider>
				<SavingContextProvider data={content}>
					<div className="flex flex-col">
						<EditorOverlayLoader />
						<EpisodeHeader content={content} latestStatus={latestStatus} />
						<SaveContentMap />
						<FarConnection />
						<div className={cn('animate-fade-in-up relative')}>
							<ScrollArea className="relative overflow-y-auto">
								<EditorHandler />
							</ScrollArea>
						</div>
					</div>
				</SavingContextProvider>
			</EditorDataContextProvider>
		</Plate>
	)
}

export default function MultiEpLocalizePlateEditor() {
	const { data: content, latestStatus = 'BASE' } = useEpisodeContent()

	const {
		users,
		me: { user: userData },
	} = useProjectId()

	if (!content || !users || !userData) {
		return <EditorSkeletonLoader />
	}

	return <MyEditor {...{ content, latestStatus }} />
}
