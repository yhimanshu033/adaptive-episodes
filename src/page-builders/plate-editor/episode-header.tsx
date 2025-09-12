import React, { useMemo } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { statuses } from '@/constants/episodes-constants'
import { SIMPLIFIED_VIEWABLE_EDITOR } from '@/constants/global-constants'
import useIsInternal from '@/hooks/use-is-internal'
import { ArtBoardIcon } from '@/icons/art-borad-icon'
import { FileTextIcon } from '@/icons/file-text-icon'
import { MessageIcon } from '@/icons/message-icon'
import HomeButton from '@/page-builders/plate-editor/buttons/home-button'
import SaveEpisode from '@/page-builders/plate-editor/buttons/save-episode'
import Versions from '@/page-builders/plate-editor/buttons/versions'
import Title from '@/page-builders/plate-editor/title'

import { IconButton } from '@/components/aural-ui/icon-button'
import { Else, If, IfElse } from '@/components/aural-ui/if-else'
import { ModeToolbarButton } from '@/components/plate-ui-v2/mode-toolbar-button'
import DownloadDocxButton from '@/components/plate-ui/download-docx-button'
import Languages from '@/components/plate-ui/languages'
import UploadDocxButton from '@/components/plate-ui/publish-docx-button'
import { SidebarToggleButton } from '@/components/plate-ui/sidebar-toggle-button'
import useProjectId from '@/providers/project-id-provider'

import { ERole } from '@/types/admin-types'
import { BASE_STATUS, EStatus } from '@/types/common'
import { TGetEpisodeResponse } from '@/types/episode-type'
import { ESidebar } from '@/types/plate-types'

const EpisodeHeader = ({
	content,
	latestStatus,
}: {
	content: TGetEpisodeResponse
	latestStatus: EStatus | 'BASE'
}) => {
	const searchParams = useSearchParams()
	const simplifiedEditor = searchParams.get(SIMPLIFIED_VIEWABLE_EDITOR)

	const latestIndex = useMemo(
		() => (latestStatus !== BASE_STATUS ? statuses.indexOf(latestStatus) : 0),
		[latestStatus]
	)

	const isInternalUser = useIsInternal()
	const isCmsReady = useMemo(
		() => statuses[latestIndex] === EStatus.PUBLISHED,
		[latestIndex]
	)
	const { isAccessible } = useProjectId()

	if (simplifiedEditor) {
		return (
			<div className="flex items-center justify-between py-4">
				<p className="text-fm-primary font-fm-text [font-size:var(--text-fm-lg)]">
					{content?.chapter.seq_number}. {content?.chapter.chapter_title}
				</p>
				<SaveEpisode />
			</div>
		)
	}

	return (
		<div className="border-fm-divider-tertiary flex items-center justify-between border-l px-7 py-6">
			<div className="flex items-center gap-4">
				<HomeButton />
				<Title
					memberId={String(content?.chapter?.writer)}
					latestIndex={latestIndex}
				/>
			</div>
			<div className="flex items-center gap-2">
				<SaveEpisode />
				<SidebarToggleButton
					sidebar={ESidebar.COMMENTS}
					tooltip="Comments"
					icon={<MessageIcon />}
					label="Comments"
					size="small"
					tooltipContentProps={{
						side: 'bottom',
						align: 'center',
					}}
				/>
				<SidebarToggleButton
					sidebar={ESidebar.NOTES}
					tooltip="Notes"
					icon={<FileTextIcon />}
					label="Notes"
					size="small"
					tooltipContentProps={{
						side: 'bottom',
						align: 'center',
					}}
				/>

				<Link
					href={`/projects/${content?.chapter?.project}/${content?.chapter?.parent || content?.chapter?.id}/preview`}
				>
					<IconButton
						variant="ghost"
						shape="square"
						tooltip="Preview"
						icon={<ArtBoardIcon />}
						label="Preview"
						size="small"
						tooltipContentProps={{
							side: 'bottom',
							align: 'center',
						}}
						className="hover:text-fm-secondary-800 hover:bg-fm-secondary-50 text-fm-icon-active size-7 shrink-0"
					/>
				</Link>

				<Languages />
				<Versions latestStatus={latestStatus} isChildEpisode={false} />
				<ModeToolbarButton />
				<IfElse
					condition={isInternalUser && isCmsReady && isAccessible(ERole.WRITER)}
				>
					<If>
						<UploadDocxButton />
					</If>
					<Else>
						<DownloadDocxButton />
					</Else>
				</IfElse>
			</div>
		</div>
	)
}

export default EpisodeHeader
