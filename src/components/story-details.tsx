'use client'

import React from 'react'
import { COPILOT_LOGO_URL } from '@/constants/global-constants'
import { EditBigIcon } from '@/icons/edit-big-icon'
import EditProjectDialog from '@/page-builders/episodes/dialogs/edit-project-dialog'

import AuthWrapper from '@/components/auth-wrapper'
import Image from '@/components/ui/image'
import useEpisodeTableContext from '@/providers/episode-table-provider'
import { cn } from '@/lib/utils/helpers'

import { ERole } from '@/types/admin-types'

interface StoryDetailsProps {
	handleClick?: () => void
	hideAuthor?: boolean
	imageClassname?: string
	imageSize?: number
	titleClassname?: string
}

const StoryDetails: React.FC<StoryDetailsProps> = ({
	titleClassname,
	imageClassname,
	imageSize = 80,
	hideAuthor,
	handleClick = () => {},
}) => {
	const { initialStoryData: storyData } = useEpisodeTableContext()

	return (
		<div onClick={handleClick} className="flex items-start gap-4">
			<div style={{ width: imageSize, height: imageSize }}>
				<Image
					src={storyData?.image || COPILOT_LOGO_URL}
					alt={`${storyData?.project_title} thumbnail`}
					width={imageSize}
					height={imageSize}
					className={cn('rounded-md', imageClassname)}
				/>
			</div>
			<div>
				<div className="flex items-center gap-4">
					<h2 className={cn('font-fm-text text-3xl', titleClassname)}>
						{storyData?.project_title}
					</h2>
					<AuthWrapper role={ERole.ADMIN}>
						<EditProjectDialog>
							<EditBigIcon
								width={20}
								height={20}
								className="text-fm-icon-brand-secondary cursor-pointer"
							/>
						</EditProjectDialog>
					</AuthWrapper>
				</div>
				{!hideAuthor && (
					<h4 className="font-fm-brand text-fm-tertiary text-xs uppercase">
						{storyData?.author ?? ''}
					</h4>
				)}
			</div>
		</div>
	)
}

export default StoryDetails
