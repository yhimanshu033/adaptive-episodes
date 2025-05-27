import React from 'react'
import { useSearchParams } from 'next/navigation'
import { SIMPLIFIED_VIEWABLE_EDITOR } from '@/constants/global-constants'
import HomeButton from '@/page-builders/plate-editor/buttons/home-button'
import SaveEpisode from '@/page-builders/plate-editor/buttons/save-episode'
import Versions from '@/page-builders/plate-editor/buttons/versions'
import Title from '@/page-builders/plate-editor/title'

import AuthWrapper from '@/components/auth-wrapper'
import { Icons } from '@/components/icons'
import DownloadDocxButton from '@/components/plate-ui/download-docx-button'
import Languages from '@/components/plate-ui/languages'
import { ModeDropdown } from '@/components/plate-ui/mode-dropdown'
import UploadDocxButton from '@/components/plate-ui/publish-docx-button'
import { SidebarToggleButton } from '@/components/plate-ui/sidebar-toggle-button'

import { ERole } from '@/types/admin-types'
import { EStatus } from '@/types/common'
import { TGetEpisodeResponse } from '@/types/episode-type'
import { ESidebar } from '@/types/plate-types'

const EpisodeHeader = ({
	content,
	isChildEpisode,
	latestStatus,
}: {
	content: TGetEpisodeResponse
	isChildEpisode: boolean
	latestStatus: EStatus | 'BASE'
}) => {
	const searchParams = useSearchParams()
	const simplifiedEditor = searchParams.get(SIMPLIFIED_VIEWABLE_EDITOR)

	if (simplifiedEditor) {
		return (
			<div className="animate-fade-in-up flex items-center justify-between">
				<p className="text-xl">
					{content?.chapter.seq_number}. {content?.chapter.chapter_title}
				</p>
				<SaveEpisode />
			</div>
		)
	}

	return (
		<div className="animate-fade-in-up flex items-center justify-between border-l py-4 pl-10">
			<div className="flex items-center gap-2">
				<HomeButton />
				<Title
					chapterId={String(content?.chapter?.id)}
					memberId={String(content?.chapter?.writer)}
				/>
			</div>
			<div className="flex items-center gap-2">
				<SaveEpisode />
				<SidebarToggleButton sidebar={ESidebar.COMMENTS} tooltip="Comments">
					<Icons.comment />
				</SidebarToggleButton>
				<SidebarToggleButton sidebar={ESidebar.NOTES} tooltip="Notes">
					<Icons.attachment />
				</SidebarToggleButton>
				<Languages />
				<AuthWrapper role={ERole.WRITER}>
					<Versions
						isChildEpisode={isChildEpisode}
						latestStatus={latestStatus}
					/>
					<DownloadDocxButton latestStatus={latestStatus} />
					<UploadDocxButton latestStatus={latestStatus} />
				</AuthWrapper>
				<ModeDropdown />
			</div>
		</div>
	)
}

export default EpisodeHeader
