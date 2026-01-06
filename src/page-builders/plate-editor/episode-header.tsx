import React, { useMemo } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { QUICK_PROMPTS, QUICK_PROMPTS_EN } from '@/constants/ai-constants'
import { statuses } from '@/constants/episodes-constants'
import { SIMPLIFIED_VIEWABLE_EDITOR } from '@/constants/global-constants'
import useEpisodeContent from '@/hooks/query/use-episode-content'
import useIsGerman from '@/hooks/use-is-german'
import useIsInternal from '@/hooks/use-is-internal'
import { ArtBoardIcon } from '@/icons/art-borad-icon'
import { FileTextIcon } from '@/icons/file-text-icon'
import { MessageIcon } from '@/icons/message-icon'
import HomeButton from '@/page-builders/plate-editor/buttons/home-button'
import SaveEpisode from '@/page-builders/plate-editor/buttons/save-episode'
import UGCActions from '@/page-builders/plate-editor/buttons/ugc-actions'
import Versions from '@/page-builders/plate-editor/buttons/versions'
import ConfigurationDialogTrigger from '@/page-builders/plate-editor/configuration-dialog/trigger'
import Title from '@/page-builders/plate-editor/title'
import { ESidebar } from 'unified-editor'

import { IconButton } from '@/components/aural-ui/icon-button'
import { Else, If, IfElse } from '@/components/aural-ui/if-else'
import DownloadAudio from '@/components/download-audio'
import { ModeToolbarButton } from '@/components/plate-ui-v2/mode-toolbar-button'
import DownloadDocxButton from '@/components/plate-ui/download-docx-button'
import Languages from '@/components/plate-ui/languages'
import UploadDocxButton from '@/components/plate-ui/publish-docx-button'
import { SidebarToggleButton } from '@/components/plate-ui/sidebar-toggle-button'
import useProjectId from '@/providers/project-id-provider'

import { ERole } from '@/types/admin-types'
import { BASE_STATUS, EStatus } from '@/types/common'

const EpisodeHeader = () => {
	const searchParams = useSearchParams()
	const simplifiedEditor = searchParams.get(SIMPLIFIED_VIEWABLE_EDITOR)

	const isGerman = useIsGerman()

	const { data: content, latestStatus = BASE_STATUS } = useEpisodeContent()

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
				<p className="text-fm-primary font-fm-text text-fm-lg">
					{content?.chapter.seq_number}. {content?.chapter.chapter_title}
				</p>
				<SaveEpisode />
			</div>
		)
	}

	return (
		<div className="border-fm-divider-tertiary flex items-center justify-between border-l py-6 pr-2 pl-7">
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

				<DownloadAudio />
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
				<ConfigurationDialogTrigger
					fallbackQuickPrompts={isGerman ? QUICK_PROMPTS : QUICK_PROMPTS_EN}
					episodeId={content?.chapter?.id}
					showEpisodeSpecificActions
				/>
				<UGCActions />
			</div>
		</div>
	)
}

export default EpisodeHeader
