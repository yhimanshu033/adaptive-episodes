'use client'

import React from 'react'
import Image from 'next/image'
import { COPILOT_LOGO_URL } from '@/constants/global-constants'
import AuthorTitle from '@/page-builders/episodes/author'

import useEpisodeTableContext from '@/providers/episode-table-provider'
import { cn } from '@/lib/utils/helpers'

interface StoryDetailsProps {
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
}) => {
	const { initialStoryData: storyData } = useEpisodeTableContext()

	return (
		<div className="flex items-center gap-2">
			<Image
				src={storyData?.image || COPILOT_LOGO_URL}
				alt={`${storyData?.project_title} thumbnail`}
				width={imageSize}
				height={imageSize}
				objectFit="cover"
				className={cn('rounded-md', imageClassname)}
				loading="lazy"
				unoptimized
			/>
			<div>
				<h1 className={cn('text-3xl font-bold', titleClassname)}>
					{storyData?.project_title}
				</h1>
				{!hideAuthor && <AuthorTitle />}
			</div>
		</div>
	)
}

export default StoryDetails
