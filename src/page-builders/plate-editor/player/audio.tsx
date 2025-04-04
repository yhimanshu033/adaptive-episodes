import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Pause, Play } from 'lucide-react'

import IfElse from '@/components/if-else'
import { Button } from '@/components/ui/button'
import { CircularProgressBar } from '@/components/ui/circular-progress'
import { Slider } from '@/components/ui/slider'
import Spinner from '@/components/ui/spinner'
import { formatDuration } from '@/lib/utils/helpers'

import { TPlayingEpisode } from '@/types/episode-type'

export default function PlayerAudio({ src, info }: TPlayingEpisode) {
	const audioRef = useRef<HTMLAudioElement | null>(null)
	const [time, setTime] = useState(0)
	const [duration, setDuration] = useState(0)
	const [isPlaying, setIsPlaying] = useState(true)

	const handleTimeUpdate = useCallback((time: number) => {
		const audioElem = audioRef.current
		if (!audioElem) return

		audioElem.currentTime = time
	}, [])

	const handlePlayPause = useCallback(() => {
		const audioElem = audioRef.current
		if (!audioElem) return

		if (isPlaying) {
			audioElem.pause()
		} else {
			audioElem.play()
		}
	}, [isPlaying])

	if (!src) {
		return <Spinner />
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
				src={src}
				className="hidden"
			/>
			<div className="flex px-2 py-1.5">
				<div className="relative">
					{/* <CircularProgressBar className='absolute -z-10 inset-0 size-full ' value={time} min={0} max={duration} gaugePrimaryColor='hsl(var(--primary))' gaugeSecondaryColor='hsl(var(--secondary))'>
                            <img src={info.img} className='size-full rounded-full' alt={info.chapter} />
                            </CircularProgressBar> */}
					<Button
						className="z-20 mr-2 size-5 rounded-full hover:bg-transparent"
						onClick={handlePlayPause}
						variant="ghost"
						size="icon"
					>
						<IfElse condition={isPlaying} if={<Pause />} else={<Play />} />
					</Button>
				</div>
				<div className="mt-2 flex grow flex-col gap-2">
					<div className="pl-2">
						<Slider
							className='*:h-1 [&_span[role="slider"]]:size-3 [&_span[role="slider"]]:-translate-y-1/3'
							value={[time]}
							max={duration}
							min={0}
							onValueChange={(v) => handleTimeUpdate(v[0])}
						/>
					</div>
					<div className="flex w-full items-center justify-between text-[8px] font-light">
						<p>{formatDuration(time)}</p>
						<p>{formatDuration(duration)}</p>
					</div>
				</div>
			</div>
		</div>
	)
}
