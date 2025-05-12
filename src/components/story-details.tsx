'use client'

import React from 'react'
import { COPILOT_LOGO_URL } from '@/constants/global-constants'
import AuthorTitle from '@/page-builders/episodes/author'
import StoryTitle from '@/page-builders/episodes/story-title'

import Image from '@/components/ui/image'
import useEpisodeTableContext from '@/providers/episode-table-provider'
import { cn } from '@/lib/utils/helpers'

interface StoryDetailsProps {
	editable?: boolean
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
	editable = false,
	handleClick = () => {},
}) => {
	const { initialStoryData: storyData } = useEpisodeTableContext()

	return (
		<div
			onClick={handleClick}
			className="flex cursor-pointer items-center gap-2"
		>
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
				<StoryTitle
					isEditable={editable}
					text={storyData?.project_title || ''}
					textClass={cn('text-3xl font-bold', titleClassname)}
				/>
				{!hideAuthor && <AuthorTitle />}
			</div>
		</div>
	)
}

export default StoryDetails
