'use client'

import React from 'react'
import { COPILOT_LOGO_URL } from '@/constants/global-constants'
import EditProjectDialog from '@/page-builders/episodes/dialogs/edit-project-dialog'
import AuthorTitle from '@/page-builders/episodes/info/author'
import { Edit } from 'lucide-react'

import { Button } from '@/components/ui/button'
import Image from '@/components/ui/image'
import useEpisodeTableContext from '@/providers/episode-table-provider'
import { cn } from '@/lib/utils/helpers'

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
				<div className="flex gap-2">
					<h2 className={cn('text-3xl font-bold', titleClassname)}>
						{storyData?.project_title}
					</h2>
					<EditProjectDialog>
						<Button variant="ghost" size="icon">
							<Edit />
						</Button>
					</EditProjectDialog>
				</div>
				{!hideAuthor && <AuthorTitle />}
			</div>
		</div>
	)
}

export default StoryDetails
