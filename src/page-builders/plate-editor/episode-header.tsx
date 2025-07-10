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
import Title from '@/page-builders/plate-editor/title'
import { useEditorPlugin, useEditorState } from 'platejs/react'

import { IconButton } from '@/components/aural-ui/icon-button'
import { Else, If, IfElse } from '@/components/aural-ui/if-else'
import { useCreateDiscussionKit } from '@/components/editor/plugins/discussion-kit'
import DownloadDocxButton from '@/components/plate-ui/download-docx-button'
import Languages from '@/components/plate-ui/languages'
import { ModeDropdown } from '@/components/plate-ui/mode-dropdown'
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
	const discussionPlugin = useCreateDiscussionKit()
	const isInternalUser = useIsInternal()
	const { isAccessible } = useProjectId()

	const { children } = useEditorState()
	const { getOptions } = useEditorPlugin(discussionPlugin)

	const latestIndex = useMemo(
		() => (latestStatus !== BASE_STATUS ? statuses.indexOf(latestStatus) : 0),
		[latestStatus]
	)

	const isCmsReady = statuses[latestIndex] === EStatus.PUBLISHED

	if (simplifiedEditor) {
		return (
			<div className="animate-fade-in-up flex items-center justify-between py-4">
				<p className="text-fm-primary font-fm-text [font-size:var(--text-fm-lg)]">
					{content?.chapter.seq_number}. {content?.chapter.chapter_title}
				</p>
				<SaveEpisode />
			</div>
		)
	}

	return (
		<div className="animate-fade-in-up border-fm-divider-tertiary flex items-center justify-between border-r border-l px-7 py-6">
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
					href={`/projects/${content?.chapter?.project}/${content?.chapter?.parent}/preview`}
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
				{/* <ModeDropdown /> */}
				{/* <IfElse
					condition={isInternalUser && isCmsReady && isAccessible(ERole.WRITER)}
				>
					<If>
						<UploadDocxButton latestStatus={latestStatus} />
					</If>
					<Else>
						<DownloadDocxButton latestStatus={latestStatus} />
					</Else>
				</IfElse> */}
			</div>
		</div>
	)
}

export default EpisodeHeader
