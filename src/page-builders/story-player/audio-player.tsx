'use client'

import React, { useCallback, useEffect, useRef } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useAudioPlayerStore } from '@/store/audio-player-store'
import { useUserPreferencesStore } from '@/store/user-preferences-store'
import {
	ChevronLeft,
	Pause,
	Play,
	RotateCcw,
	RotateCw,
	SkipBack,
	SkipForward,
	Volume2,
	VolumeX,
} from 'lucide-react'

import { IconButton } from '@/components/aural-ui/icon-button'
import { If } from '@/components/aural-ui/if-else'
import { Slider } from '@/components/aural-ui/slider'
import { Tag } from '@/components/aural-ui/tag'
import { Typography } from '@/components/aural-ui/typography'
import { cn } from '@/lib/aural-ui/utils'

import { getAudioForPreference, ListeningProfile, StoryDetails } from './data'

interface AudioPlayerProps {
	story: StoryDetails
}

function formatTime(seconds: number): string {
	if (isNaN(seconds)) {
		return '00:00'
	}
	const mins = Math.floor(seconds / 60)
	const secs = Math.floor(seconds % 60)
	return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

export default function AudioPlayer({ story }: AudioPlayerProps) {
	const router = useRouter()
	const audioRef = useRef<HTMLAudioElement>(null)

	const {
		currentEpisode,
		isPlaying,
		currentTime,
		duration,
		volume,
		isMuted,
		togglePlayPause,
		setCurrentTime,
		setDuration,
		setVolume,
		setCurrentEpisode,
		setIsPlaying,
		setIsMuted,
	} = useAudioPlayerStore()

	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-return
	const bucketResult = useUserPreferencesStore((state) => state.bucketResult)
	// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
	const bucketValue = bucketResult?.bucket
	const listeningProfile: ListeningProfile = bucketValue ?? 'original'

	// Get audio URL based on current preference
	const audioUrl = currentEpisode
		? getAudioForPreference(currentEpisode, listeningProfile)
		: null

	// Sync play/pause state with audio element
	useEffect(() => {
		const audio = audioRef.current
		if (!audio) {
			return
		}

		if (isPlaying) {
			audio.play().catch(console.error)
		} else {
			audio.pause()
		}
	}, [isPlaying])

	// Sync volume and mute
	useEffect(() => {
		const audio = audioRef.current
		if (!audio) {
			return
		}

		audio.volume = isMuted ? 0 : volume
		audio.muted = isMuted
	}, [volume, isMuted])

	// Handle audio element events
	const handleTimeUpdate = useCallback(() => {
		const audio = audioRef.current
		if (audio) {
			setCurrentTime(audio.currentTime)
		}
	}, [setCurrentTime])

	const handleLoadedMetadata = useCallback(() => {
		const audio = audioRef.current
		if (audio) {
			setDuration(audio.duration)
		}
	}, [setDuration])

	const handleEnded = useCallback(() => {
		// Move to next episode if available
		if (!currentEpisode) {
			return
		}
		const currentIndex = story.episodes.findIndex(
			(ep) => ep.id === currentEpisode.id
		)
		const nextEpisode = story.episodes[currentIndex + 1]
		if (nextEpisode && !nextEpisode.isLocked) {
			setCurrentEpisode(nextEpisode)
		} else {
			setIsPlaying(false)
		}
	}, [currentEpisode, story.episodes, setCurrentEpisode, setIsPlaying])

	// Handle seek
	const handleSeekChange = (value: number[]) => {
		setCurrentTime(value[0])
	}

	const handleSeekCommit = (value: number[]) => {
		const audio = audioRef.current
		if (audio) {
			audio.currentTime = value[0]
		}
	}

	// Handle volume
	const handleVolumeChange = (value: number[]) => {
		setVolume(value[0])
		if (value[0] === 0) {
			setIsMuted(true)
		} else {
			setIsMuted(false)
		}
	}

	// Skip forward/backward
	const handleSkip = (seconds: number) => {
		const audio = audioRef.current
		if (audio) {
			const newTime = Math.max(
				0,
				Math.min(duration, audio.currentTime + seconds)
			)
			audio.currentTime = newTime
			setCurrentTime(newTime)
		}
	}

	// Navigate to next/previous episode
	const handleNextEpisode = () => {
		if (!currentEpisode) {
			return
		}
		const currentIndex = story.episodes.findIndex(
			(ep) => ep.id === currentEpisode.id
		)
		const nextEpisode = story.episodes[currentIndex + 1]
		if (nextEpisode && !nextEpisode.isLocked) {
			setCurrentEpisode(nextEpisode)
		}
	}

	const handlePreviousEpisode = () => {
		if (!currentEpisode) {
			return
		}
		const currentIndex = story.episodes.findIndex(
			(ep) => ep.id === currentEpisode.id
		)
		const prevEpisode = story.episodes[currentIndex - 1]
		if (prevEpisode && !prevEpisode.isLocked) {
			setCurrentEpisode(prevEpisode)
		}
	}

	// Go back to home
	const handleGoBack = () => {
		router.push('/')
	}

	// Auto-play first episode if none selected
	useEffect(() => {
		if (!currentEpisode && story.episodes.length > 0) {
			const firstUnlockedEpisode = story.episodes.find((ep) => !ep.isLocked)
			if (firstUnlockedEpisode) {
				setCurrentEpisode(firstUnlockedEpisode)
			}
		}
	}, [currentEpisode, story.episodes, setCurrentEpisode])

	// When episode changes, reset and load new audio
	useEffect(() => {
		const audio = audioRef.current
		if (audio && audioUrl) {
			audio.load()
			if (isPlaying) {
				audio.play().catch(console.error)
			}
		}
	}, [audioUrl, isPlaying])

	return (
		<div className="flex h-full flex-1 flex-col">
			{/* Hidden audio element */}
			<audio
				ref={audioRef}
				src={audioUrl || undefined}
				onTimeUpdate={handleTimeUpdate}
				onLoadedMetadata={handleLoadedMetadata}
				onEnded={handleEnded}
				preload="metadata"
				style={{ display: 'none' }}
			/>

			{/* Top navigation with back button */}
			<div className="border-fm-divider-secondary flex items-center gap-4 border-b px-6 py-4">
				<button
					onClick={handleGoBack}
					className="text-fm-tertiary hover:text-fm-primary flex items-center gap-2 transition-colors"
				>
					<ChevronLeft className="size-5" />
					<Typography variant="label-small">Back to Stories</Typography>
				</button>
			</div>

			{/* Main player area */}
			<div className="flex flex-1 flex-col items-center justify-center p-8">
				{/* Cover art - clean without overlays */}
				<div className="relative mb-8 aspect-video w-full max-w-3xl overflow-hidden rounded-xl shadow-2xl">
					<Image
						src={story.coverUrl}
						alt={story.title}
						fill
						className="object-cover"
						priority
					/>
				</div>

				{/* Episode info */}
				<div className="mb-6 text-center">
					<Typography variant="title-small" className="text-fm-primary mb-1">
						{story.title}
						<If condition={!!currentEpisode}>
							<span className="text-fm-tertiary">
								{' '}
								• Ep {currentEpisode?.number} - {currentEpisode?.title}
							</span>
						</If>
					</Typography>

					{/* Listening mode indicator */}
					<div className="mt-3 flex items-center justify-center gap-2">
						<Tag
							color={
								listeningProfile === 'speed'
									? 'warning'
									: listeningProfile === 'immersive'
										? 'info'
										: listeningProfile === 'distracted'
											? 'positive'
											: 'neutral'
							}
							emphasis="secondary"
							size="xs"
						>
							{listeningProfile.toUpperCase()} MODE
						</Tag>
					</div>
				</div>

				{/* Player controls */}
				<div className="w-full max-w-2xl">
					{/* Progress bar using aural-ui Slider */}
					<div className="mb-4 flex items-center gap-3">
						<Typography
							variant="caption-small"
							color="tertiary"
							className="w-12"
						>
							{formatTime(currentTime)}
						</Typography>

						<Slider
							value={[currentTime]}
							max={duration || 100}
							min={0}
							step={1}
							onValueChange={handleSeekChange}
							onValueCommit={handleSeekCommit}
							variant="primary"
							size="sm"
							showLabel={false}
							className="flex-1"
							classes={{
								thumb: 'rounded-full min-w-3 min-h-3 p-0',
								track: 'rounded-full',
								range: 'rounded-full',
							}}
						/>

						<Typography
							variant="caption-small"
							color="tertiary"
							className="w-12"
						>
							{formatTime(duration)}
						</Typography>
					</div>

					{/* Control buttons */}
					<div className="flex items-center justify-center gap-4">
						{/* Volume */}
						<div className="flex items-center gap-2">
							<IconButton
								icon={isMuted || volume === 0 ? <VolumeX /> : <Volume2 />}
								label={isMuted ? 'Unmute' : 'Mute'}
								variant="ghost"
								size="small"
								onClick={() => {
									if (isMuted) {
										setIsMuted(false)
										setVolume(0.8)
									} else {
										setIsMuted(true)
									}
								}}
							/>
							<Slider
								value={[isMuted ? 0 : volume]}
								max={1}
								min={0}
								step={0.01}
								onValueChange={handleVolumeChange}
								variant="default"
								size="sm"
								showLabel={false}
								className="w-20"
								classes={{
									thumb: 'rounded-full min-w-2.5 min-h-2.5 p-0',
									track: 'rounded-full',
									range: 'rounded-full',
								}}
							/>
						</div>

						{/* Previous Episode */}
						<IconButton
							icon={<SkipBack />}
							label="Previous Episode"
							variant="ghost"
							size="small"
							onClick={handlePreviousEpisode}
						/>

						{/* Skip back 10 seconds */}
						<IconButton
							icon={<RotateCcw />}
							label="Rewind 10 seconds"
							variant="ghost"
							size="medium"
							onClick={() => handleSkip(-10)}
						/>

						{/* Play/Pause */}
						<button
							onClick={togglePlayPause}
							className={cn(
								'flex size-16 items-center justify-center rounded-full transition-all',
								'bg-linear-to-br from-pink-500 to-rose-600 text-white shadow-lg hover:shadow-xl',
								'hover:scale-105 active:scale-95'
							)}
							aria-label={isPlaying ? 'Pause' : 'Play'}
						>
							<If condition={isPlaying}>
								<Pause className="size-7" />
							</If>
							<If condition={!isPlaying}>
								<Play className="size-7 translate-x-0.5" />
							</If>
						</button>

						{/* Skip forward 10 seconds */}
						<IconButton
							icon={<RotateCw />}
							label="Forward 10 seconds"
							variant="ghost"
							size="medium"
							onClick={() => handleSkip(10)}
						/>

						{/* Next Episode */}
						<IconButton
							icon={<SkipForward />}
							label="Next Episode"
							variant="ghost"
							size="small"
							onClick={handleNextEpisode}
						/>
					</div>
				</div>
			</div>
		</div>
	)
}
