'use client'

import React from 'react'
import { COPILOT_LOGO_URL } from '@/constants/global-constants'
import { EditBigIcon } from '@/icons/edit-big-icon'
import EditProjectDialog from '@/page-builders/episodes/dialogs/edit-project-dialog'

import { IconButton } from '@/components/aural-ui/icon-button'
import { Skeleton } from '@/components/aural-ui/skelton'
import IfElse, { Else, If } from '@/components/if-else'
import Image from '@/components/ui/image'
import useEpisodeTableContext from '@/providers/episode-table-provider'
import { cn } from '@/lib/utils/helpers'

interface StoryDetailsProps {
	handleClick?: () => void
	hideAuthor?: boolean
	imageClassname?: string
	imageSize?: number
	isLoading?: boolean
	titleClassname?: string
}

const StoryDetails: React.FC<StoryDetailsProps> = ({
	titleClassname,
	imageClassname,
	isLoading = false,
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
				<IfElse condition={isLoading}>
					<If>
						<Skeleton className="block h-6 w-32" />
						<Skeleton className="mt-2 h-4 w-24" />
					</If>
					<Else>
						<div className="flex items-center gap-2">
							<h2 className={cn('font-fm-text text-3xl', titleClassname)}>
								{storyData?.project_title}
							</h2>
							<EditProjectDialog>
								<IconButton
									icon={
										<EditBigIcon className="text-fm-icon-brand-secondary" />
									}
									size="xSmall"
									label="edit"
									variant="ghost"
									className="p-0"
								/>
							</EditProjectDialog>
						</div>
						{!hideAuthor && (
							<h4 className="font-fm-brand text-fm-tertiary ml-1 text-xs uppercase">
								{storyData?.author ?? ''}
							</h4>
						)}
					</Else>
				</IfElse>
			</div>
		</div>
	)
}

export default StoryDetails
