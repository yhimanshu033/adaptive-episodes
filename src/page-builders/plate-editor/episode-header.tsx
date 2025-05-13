import React, { useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import { SIMPLIFIED_VIEWABLE_EDITOR } from '@/constants/global-constants'
import EpisodeButton from '@/page-builders/plate-editor/buttons/episode-button'
import HomeButton from '@/page-builders/plate-editor/buttons/home-button'
import SaveEpisode from '@/page-builders/plate-editor/buttons/save-episode'
import Versions from '@/page-builders/plate-editor/buttons/versions'
import SplitButton from '@/page-builders/plate-editor/split-editor/split-button'
import Title from '@/page-builders/plate-editor/title'
import useEditorExtendedStore from '@/store/extended-store'

import AuthWrapper from '@/components/auth-wrapper'
import { If } from '@/components/if-else'
import DownloadDocxButton from '@/components/plate-ui/download-docx-button'
import Languages from '@/components/plate-ui/languages'
import UploadDocxButton from '@/components/plate-ui/publish-docx-button'
import useEpisodeId from '@/providers/episode-id-provider'

import { ERole } from '@/types/admin-types'
import { EStatus } from '@/types/common'
import { TGetEpisodeResponse } from '@/types/episode-type'

const EpisodeHeader = ({
	content,
	isChildEpisode,
	latestStatus,
}: {
	content: TGetEpisodeResponse
	isChildEpisode: boolean
	latestStatus: EStatus | 'BASE'
}) => {
	const { store: extendStore, updateExtended } = useEditorExtendedStore()
	const { extended } = extendStore()
	const episodeId = useEpisodeId()

	const searchParams = useSearchParams()
	const simplifiedEditor = searchParams.get(SIMPLIFIED_VIEWABLE_EDITOR)

	const isFirst = useMemo(
		() => episodeId === extended[0],
		[episodeId, extended]
	)

	if (simplifiedEditor) {
		return (
			<div className="flex animate-fade-in-up items-center justify-between">
				<p className="text-xl">
					{content?.chapter.seq_number}. {content?.chapter.chapter_title}
				</p>
				<SaveEpisode />
			</div>
		)
	}

	return (
		<div className="-my-4 flex animate-fade-in-up items-center justify-between border-l py-4 pl-10">
			<div className="flex items-center gap-2">
				<HomeButton />
				<Title
					chapterId={String(content?.chapter?.id)}
					memberId={String(content?.chapter?.writer)}
				/>
			</div>
			<div className="flex items-center gap-2">
				<If condition={isFirst}>
					<SplitButton
						tooltip="Previous Episode Extension"
						className="px-2"
						disabled={!content?.previous_parent_id}
						onClick={() =>
							updateExtended(Number(content?.previous_parent_id), 'prev')
						}
					/>
				</If>
				<Languages />
				<AuthWrapper role={ERole.WRITER}>
					<Versions
						isChildEpisode={isChildEpisode}
						latestStatus={latestStatus}
					/>
					<DownloadDocxButton latestStatus={latestStatus} />
					<UploadDocxButton latestStatus={latestStatus} />
				</AuthWrapper>
				<SaveEpisode />
				<EpisodeButton direction="next" episodeId={content?.next_parent_id} />
			</div>
		</div>
	)
}

export default EpisodeHeader
