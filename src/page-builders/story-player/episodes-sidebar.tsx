'use client'

import React from 'react'
import { useAudioPlayerStore } from '@/store/audio-player-store'
import { Lock, Pause, Play } from 'lucide-react'

import { If } from '@/components/aural-ui/if-else'
import { ScrollArea } from '@/components/aural-ui/scroll-area'
import { Tag } from '@/components/aural-ui/tag'
import { Typography } from '@/components/aural-ui/typography'
import { cn } from '@/lib/aural-ui/utils'

import { Episode, StoryDetails } from './data'

interface EpisodesSidebarProps {
	story: StoryDetails
}

export default function EpisodesSidebar({ story }: EpisodesSidebarProps) {
	const { currentEpisode, isPlaying, setCurrentEpisode } = useAudioPlayerStore()

	const handleEpisodeClick = (episode: Episode) => {
		if (episode.isLocked) {
			return // Don't play locked episodes
		}
		setCurrentEpisode(episode)
	}

	return (
		<aside className="bg-fm-surface-primary border-fm-divider-secondary flex h-screen w-[400px] shrink-0 flex-col border-l">
			{/* Header with tabs */}
			<div className="border-fm-divider-secondary border-b px-6 py-3.5">
				<div className="flex items-center gap-6">
					<div className="relative">
						<Typography variant="label-medium" className="text-fm-primary">
							Episodes
						</Typography>
						<Typography
							variant="caption-small"
							color="tertiary"
							className="absolute -top-1 -right-8"
						>
							{story.totalEpisodes}
						</Typography>
						<div className="absolute -bottom-4 left-0 h-0.5 w-full bg-pink-500" />
					</div>
				</div>
			</div>

			{/* Episodes list */}
			<ScrollArea className="flex-1">
				<div className="flex flex-col">
					{story.episodes.map((episode) => {
						const isCurrentEpisode = currentEpisode?.id === episode.id
						const isCurrentlyPlaying = isCurrentEpisode && isPlaying

						return (
							<button
								key={episode.id}
								onClick={() => handleEpisodeClick(episode)}
								disabled={episode.isLocked}
								className={cn(
									'hover:bg-fm-surface-secondary/50 group flex items-center justify-between gap-4 px-6 py-4 text-left transition-colors',
									isCurrentEpisode && 'bg-fm-surface-secondary/30',
									episode.isLocked && 'cursor-not-allowed opacity-60'
								)}
							>
								<div className="flex flex-col gap-1">
									{/* Episode title */}
									<div className="flex items-center gap-2">
										<Typography
											variant="label-small"
											className={cn(
												isCurrentEpisode
													? 'text-fm-primary'
													: 'text-fm-secondary'
											)}
										>
											E{episode.number}. {episode.title}
										</Typography>
									</div>

									{/* Episode meta */}
									<div className="flex items-center gap-2">
										<Typography variant="caption-small" color="tertiary">
											{episode.duration}
										</Typography>
										<span className="text-fm-tertiary text-xs">•</span>
										<Typography variant="caption-small" color="tertiary">
											{episode.releaseDate}
										</Typography>

										{/* Now Playing badge */}
										<If condition={isCurrentlyPlaying}>
											<Tag
												color="hotpink"
												emphasis="primary"
												size="xs"
												className="ml-2"
											>
												<span className="flex items-center gap-1">
													<span className="flex gap-0.5">
														{[1, 2, 3].map((i) => (
															<span
																key={i}
																className="inline-block w-0.5 animate-pulse bg-white"
																style={{
																	height: `${6 + i * 2}px`,
																	animationDelay: `${i * 0.1}s`,
																}}
															/>
														))}
													</span>
													NOW PLAYING
												</span>
											</Tag>
										</If>
									</div>

									{/* Unlock info for locked episodes */}
									<If condition={!!episode.unlockInfo}>
										<div className="flex items-center gap-1 text-amber-500">
											<span className="size-2 rounded-full bg-amber-500" />
											<Typography variant="caption-small">
												{episode.unlockInfo}
											</Typography>
										</div>
									</If>
								</div>

								{/* Play/Pause button or Lock icon */}
								<div className="shrink-0">
									<If condition={episode.isLocked}>
										<div className="border-fm-divider-secondary flex size-10 items-center justify-center rounded-full border">
											<Lock className="text-fm-tertiary size-4" />
										</div>
									</If>
									<If condition={!episode.isLocked}>
										<div
											className={cn(
												'flex size-10 items-center justify-center rounded-full border transition-colors',
												isCurrentlyPlaying
													? 'border-pink-500 bg-pink-500/10'
													: 'border-fm-divider-secondary group-hover:border-fm-divider-contrast'
											)}
										>
											<If condition={isCurrentlyPlaying}>
												<Pause
													className={cn(
														'size-4',
														isCurrentlyPlaying
															? 'text-pink-500'
															: 'text-fm-tertiary group-hover:text-fm-primary'
													)}
												/>
											</If>
											<If condition={!isCurrentlyPlaying}>
												<Play
													className={cn(
														'size-4',
														isCurrentEpisode
															? 'text-pink-500'
															: 'text-fm-tertiary group-hover:text-fm-primary'
													)}
												/>
											</If>
										</div>
									</If>
								</div>
							</button>
						)
					})}
				</div>
			</ScrollArea>
		</aside>
	)
}
