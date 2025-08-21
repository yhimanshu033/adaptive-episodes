import React from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { EPISODE_SEQUENCE } from '@/constants/global-constants'

import {
	buttonVariants,
	innerButtonVariants,
} from '@/components/aural-ui/button'
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from '@/components/aural-ui/tooltip'
import { cn } from '@/lib/utils/helpers'

import { TEpisode } from '@/types/episode-type'

interface EpisodeNavigationButtonProps {
	handleClick: () => void
	item: TEpisode
}
export default function EpisodeNavigationButton({
	item,
	handleClick,
}: EpisodeNavigationButtonProps) {
	const episode_id = item.parent || item.id
	const { episodeId, id } = useParams()
	const isActive = episode_id === Number(episodeId)

	return (
		<Tooltip>
			<TooltipTrigger asChild>
				<Link
					href={`/projects/${String(id)}/${String(episode_id)}/content?${EPISODE_SEQUENCE}=${item.seq_number}`}
					className={cn(
						buttonVariants({
							variant: 'text',
						}),
						'group text-fm-placeholder leading-fm-md border-l-2 border-transparent [font-size:var(--text-fm-md)] backdrop-blur-3xl focus-visible:ring-0 focus-visible:ring-offset-0',
						{
							'bg-fm-hotpink-50 text-fm-secondary-800 border-fm-hotpink-200':
								isActive,
							'hover:bg-fm-hotpink-50 focus-visible:bg-fm-hotpink-50 hover:text-fm-secondary-800 focus-visible:text-fm-secondary-800':
								!isActive,
						}
					)}
					id={`ep-btn-${episode_id}`}
					onClick={handleClick}
				>
					<span
						className={cn(
							innerButtonVariants({
								variant: 'text',
							}),
							'!px-fm-2xl translate-y-0 justify-start rounded-none'
						)}
					>
						EP {item.seq_number}
					</span>
				</Link>
			</TooltipTrigger>
			<TooltipContent side="right">{item.chapter_title}</TooltipContent>
		</Tooltip>
	)
}
