import React from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { EPISODE_SEQUENCE } from '@/constants/global-constants'
import { PlusIcon } from '@/icons/plus-icon'

import {
	buttonVariants,
	innerButtonVariants,
} from '@/components/aural-ui/button'
import { IconButton } from '@/components/aural-ui/icon-button'
import { If } from '@/components/aural-ui/if-else'
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
	onPlus?: (item: TEpisode) => void
	showPlus?: boolean
}
export default function EpisodeNavigationButton({
	item,
	handleClick,
	onPlus = () => {},
	showPlus = false,
}: EpisodeNavigationButtonProps) {
	const episode_id = item.parent || item.id
	const { episodeId, id } = useParams()
	const isActive = episode_id === Number(episodeId)

	return (
		<div
			className={cn(
				'group relative border-l-2 border-transparent backdrop-blur-3xl',
				{
					'bg-fm-hotpink-50 text-fm-secondary-800 border-fm-hotpink-200':
						isActive,
					'hover:bg-fm-hotpink-50 focus-visible:bg-fm-hotpink-50 hover:text-fm-secondary-800 focus-visible:text-fm-secondary-800':
						!isActive,
				}
			)}
		>
			<If condition={showPlus}>
				<div className="absolute top-0 left-1/2 z-30 hidden -translate-x-1/2 -translate-y-1/2 p-0 group-hover:block">
					<IconButton
						variant="background"
						size="small"
						className="border-fm-divider-secondary size-6 rounded-full border"
						icon={<PlusIcon width={12} height={12} className="flex shrink-0" />}
						onClick={() => onPlus(item)}
						label={`Invent Episode at ${item.seq_number}`}
						tooltip={`Invent Episode at ${item.seq_number}`}
					/>
				</div>
			</If>
			<Tooltip>
				<TooltipTrigger asChild>
					<Link
						prefetch={false}
						href={`/projects/${String(id)}/${String(episode_id)}/content?${EPISODE_SEQUENCE}=${item.seq_number}`}
						className={cn(
							buttonVariants({
								variant: 'text',
							}),
							'group text-fm-placeholder leading-fm-md [font-size:var(--text-fm-md)] focus-visible:ring-0 focus-visible:ring-offset-0'
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
		</div>
	)
}
