'use client'

import React, { useCallback, useMemo, useState } from 'react'
import PlayerInfo from '@/page-builders/plate-editor/player/info'
import { Pause, Play, X } from 'lucide-react'

import IfElse from '@/components/if-else'
import { Button } from '@/components/ui/button'
import { CircularProgressBar } from '@/components/ui/circular-progress'
import Image from '@/components/ui/image'
import { Slider } from '@/components/ui/slider'
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
			if (!audioElem) return

			audioElem.currentTime = time
		},
		[audioRef]
	)

	const handlePlayPause = useCallback(() => {
		const audioElem = audioRef.current
		if (!audioElem) return

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
			<div className="flex rounded-md bg-background/50 p-2 backdrop-blur-[1px]">
				<div className="h-full max-h-0 w-0 overflow-hidden px-0 transition-all group-hover:max-h-20 group-hover:w-64 group-hover:pl-2 group-hover:pr-4">
					<PlayerInfo />
					<div className="mt-2 flex grow flex-col gap-2">
						<Slider
							className='*:h-1 [&_span[role="slider"]]:size-3 [&_span[role="slider"]]:-translate-y-1/3'
							value={[time]}
							max={duration}
							min={0}
							onValueChange={(v) => handleTimeUpdate(v[0])}
						/>
						<div className="flex w-full items-center justify-between text-[8px] font-light">
							<p>{formatDuration(time)}</p>
							<p>{formatDuration(duration)}</p>
						</div>
					</div>
				</div>
				<div className="relative size-20">
					<Button
						onClick={handleCancel}
						tooltip="Remove"
						className="absolute right-0.5 top-0.5 size-4 rounded-full border border-foreground p-0.5 opacity-0 group-hover:opacity-100"
						size="icon"
					>
						<X />
					</Button>
					<CircularProgressBar
						className="absolute inset-0 -z-10 size-full"
						value={time}
						min={0}
						max={duration}
						gaugePrimaryColor="hsl(var(--primary))"
						gaugeSecondaryColor="hsl(var(--secondary))"
					>
						<Image
							src={info.img || ''}
							className="size-full rounded-full p-0.5"
							alt={info.chapter || 'chapter-image'}
						/>
					</CircularProgressBar>
					<Button
						className="z-20 size-full rounded-full p-3 opacity-0 transition-opacity *:!fill-primary *:!text-primary hover:bg-transparent group-hover:opacity-100"
						onClick={handlePlayPause}
						variant="ghost"
						size="icon"
					>
						<IfElse condition={isPlaying} if={<Pause />} else={<Play />} />
					</Button>
				</div>
			</div>
		</div>
	)
}
