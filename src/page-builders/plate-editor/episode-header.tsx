import React, { useMemo } from 'react'
import EpisodeButton from '@/page-builders/plate-editor/episode-button'
import SaveEpisode from '@/page-builders/plate-editor/save-episode'
import Title from '@/page-builders/plate-editor/title'
import Versions from '@/page-builders/plate-editor/versions'
import useEditorExtendedStore from '@/store/extended-store'
import { SeparatorHorizontal } from 'lucide-react'

import AuthWrapper from '@/components/auth-wrapper'
import DownloadDocxButton from '@/components/plate-ui/download-docx-button'
import Languages from '@/components/plate-ui/languages'
import UploadDocxButton from '@/components/plate-ui/publish-docx-button'
import { Button } from '@/components/ui/button'
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

	const isFirst = useMemo(
		() => episodeId === extended[0],
		[episodeId, extended]
	)

	return (
		<div className="flex animate-fade-in-up items-center justify-between">
			<div className="flex items-center gap-2">
				<EpisodeButton
					direction="previous"
					episodeId={content?.previous_parent_id}
				/>
				<Title
					chapterId={String(content?.chapter?.id)}
					memberId={String(content?.chapter?.writer)}
				/>
			</div>
			<div className="flex items-center gap-2">
				{isFirst && (
					<Button
						tooltip="Previous Episode Extension"
						disabled={!content?.previous_parent_id}
						onClick={() =>
							updateExtended(Number(content?.previous_parent_id), 'prev')
						}
						size="icon"
						variant="outline"
						className="px-2"
					>
						<SeparatorHorizontal />
					</Button>
				)}
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
