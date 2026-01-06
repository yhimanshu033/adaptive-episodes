'use client'

import React, { useCallback, useMemo, useState } from 'react'
import { CrossCircleIcon } from '@/icons/cross-circle-icon'
import PlayerInfo from '@/page-builders/plate-editor/player/info'
import { Pause, Play } from 'lucide-react'

import { IconButton } from '@/components/aural-ui/icon-button'
import { Slider } from '@/components/aural-ui/slider'
import { CircularProgressBar } from '@/components/ui/circular-progress'
import Image from '@/components/ui/image'
import usePlayer from '@/providers/player-provider'
import { formatDuration } from '@/lib/utils/helpers'

export default function PlayerAudio() {
	const { playingEpisode, audioRef } = usePlayer()

	const info = useMemo(() => playingEpisode?.info, [playingEpisode])

	const [time, setTime] = useState(0)
	const [duration, setDuration] = useState(0)
	const [isPlaying, setIsPlaying] = useState(true)
	const { setPlayingEpisode, mutation } = usePlayer()

	const handleTimeUpdate = useCallback(
		(time: number) => {
			const audioElem = audioRef.current
			if (!audioElem) {
				return
			}

			audioElem.currentTime = time
		},
		[audioRef]
	)

	const handlePlayPause = useCallback(() => {
		const audioElem = audioRef.current
		if (!audioElem) {
			return
		}

		if (isPlaying) {
			audioElem.pause()
		} else {
			void audioElem.play()
		}
	}, [isPlaying, audioRef])

	const handleCancel = useCallback(() => {
		mutation.reset()
		setPlayingEpisode(null)
	}, [setPlayingEpisode, mutation])

	if (!info) {
		return null
	}

	return (
		<div>
			<audio
				ref={audioRef}
				autoPlay
				controls
				onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
				onPlay={() => setIsPlaying(true)}
				onPause={() => setIsPlaying(false)}
				onDurationChange={(e) => setDuration(e.currentTarget.duration)}
				className="hidden"
			/>
			<div className="bg-fm-neutral-0/50 flex h-full items-center rounded-md p-2 backdrop-blur-[1px]">
				<div className="h-full w-0 gap-2 overflow-hidden px-0 text-nowrap transition-all group-hover:w-64 group-hover:pr-4 group-hover:pl-2">
					<PlayerInfo />
					<div className="flex h-full flex-col gap-1">
						<div className="flex w-full items-center justify-end text-[8px] font-light">
							<p>{formatDuration(duration)}</p>
						</div>
						<div className="h-6">
							<Slider
								variant="secondary"
								className="rounded-md"
								value={[time]}
								max={duration}
								min={0}
								onValueChange={(v) => handleTimeUpdate(v[0])}
								showLabel
								classes={{
									thumb: 'rounded-md text-[8px]',
								}}
								label={formatDuration(time)}
							/>
						</div>
					</div>
				</div>
				<div className="relative size-20">
					<IconButton
						label="Remove audio player"
						onClick={handleCancel}
						tooltip="Remove"
						className="border-fm-primary absolute top-0.5 right-0.5 size-4 border opacity-0 group-hover:opacity-100"
						icon={<CrossCircleIcon />}
					/>
					<CircularProgressBar
						className="absolute inset-0 -z-10 size-full"
						value={time}
						min={0}
						max={duration}
						gaugePrimaryColor="var(--color-fm-green-500)"
						gaugeSecondaryColor="var(--color-fm-neutral-200)"
					>
						<Image
							src={info.img || ''}
							className="size-full rounded-full p-0.5"
							alt={info.chapter || 'chapter-image'}
						/>
						<div className="bg-fm-neutral-50/50 absolute inset-0 m-1 rounded-full opacity-0 transition-opacity group-hover:opacity-100" />
					</CircularProgressBar>
					<IconButton
						label={isPlaying ? 'Pause Btn' : 'Play Btn'}
						className="*:fill-fm-icon-active! *:text-fm-icon-active! absolute top-1/2 left-1/2 z-20 -translate-x-1/2 -translate-y-1/2 transform rounded-full p-3 opacity-0 transition-opacity group-hover:opacity-100"
						onClick={handlePlayPause}
						variant="ghost"
						tooltip={isPlaying ? 'Pause' : 'Play'}
						size="small"
						icon={isPlaying ? <Pause /> : <Play />}
					/>
				</div>
			</div>
		</div>
	)
}
