import React from 'react'
import Image from 'next/image'
import { EImportStatus } from '@/constants/story-constants'

import { Button } from '@/components/aural-ui/button'
import CircularLoader from '@/components/aural-ui/circular-loader'
import { Else, If, IfElse } from '@/components/aural-ui/if-else'
import { Typography } from '@/components/aural-ui/typography'
import useProjectId from '@/providers/project-id-provider'

import { TStory } from '@/types/story-types'

import EpisodesTableSkeleton from './episode-loading'

interface IEpisodeEmptyProps {
	initialStoryData?: TStory
	isLoading?: boolean
	setInventIndex: (index: number) => void
	setIsInventOpen: (isOpen: boolean) => void
}

const EpisodeEmpty = ({
	initialStoryData,
	setIsInventOpen,
	setInventIndex,
	isLoading = false,
}: IEpisodeEmptyProps) => {
	const { isWriter } = useProjectId()

	if (isLoading) {
		return <EpisodesTableSkeleton />
	}

	return (
		<div className="container flex h-[calc(100dvh-200px)] grow flex-col items-center justify-center gap-6">
			<Image
				src="/assets/empty-projects-bg_img.webp"
				alt="Background Image"
				fill
				priority
				className="z-[-1] object-cover"
			/>
			<IfElse condition={initialStoryData?.status === EImportStatus.IMPORTING}>
				<If>
					<div className="flex items-center gap-4">
						<CircularLoader />
						<Typography
							color="tertiary"
							align="center"
							lineHeight="normal"
							variant="body-small"
							className="animate-gradient-slide bg-clip-text text-transparent"
						>
							Importing Story ...
						</Typography>
					</div>
				</If>
				<Else>
					<IfElse condition={isWriter}>
						<If>
							<Button
								className="my-2"
								onClick={() => {
									setIsInventOpen(true)
									setInventIndex(-1)
								}}
							>
								Create New Episode
							</Button>
							<Typography
								color="tertiary"
								align="center"
								variant="body-small"
								lineHeight="normal"
							>
								It&apos;s a clean slate, for now! Create episode and
								<br />
								they will appear here.
							</Typography>
						</If>
						<Else>
							<Typography
								color="tertiary"
								align="center"
								variant="body-small"
								lineHeight="normal"
							>
								No episodes yet!
								<br />
								Ask your writer to add some episodes to get started.
							</Typography>
						</Else>
					</IfElse>
				</Else>
			</IfElse>
		</div>
	)
}

export default EpisodeEmpty
