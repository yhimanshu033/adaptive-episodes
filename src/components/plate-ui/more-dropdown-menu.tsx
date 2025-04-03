import React, { useCallback } from 'react'
import useStreamedTTS from '@/hooks/mutation/use-streamed-tts'
import useDisableTools from '@/hooks/use-disable-tools'
import usePlateStore from '@/store/plate-store'
import type { DropdownMenuProps } from '@radix-ui/react-dropdown-menu'
import { Ban, Focus, Globe, Mic, Pause, Play, Search } from 'lucide-react'

import IfElse, { Else, If } from '@/components/if-else'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
	useOpenState,
} from '@/components/plate-ui/dropdown-menu'
import { ToolbarButton } from '@/components/plate-ui/toolbar'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { formatDuration } from '@/lib/utils/helpers'

import { ESidebar } from '@/types/plate-types'

export function MoreDropdownMenu(props: DropdownMenuProps) {
	const { setSidebar, setFocusMode } = usePlateStore()
	const openState = useOpenState()
	const { isDisabled } = useDisableTools()

	const {
		mutate,
		audioUrl,
		handlePause,
		handlePlay,
		isPending,
		reset,
		time,
		duration,
		handleTimeUpdate,
		isPlaying,
	} = useStreamedTTS()

	const handlePlayPause = useCallback(() => {
		if (isPlaying) {
			handlePause()
		} else {
			handlePlay()
		}
	}, [isPlaying, handlePause, handlePlay])

	return (
		<DropdownMenu modal={false} {...openState} {...props}>
			<DropdownMenuTrigger asChild>
				<ToolbarButton pressed={openState.open} tooltip="Story Explorer +">
					<Search />
				</ToolbarButton>
			</DropdownMenuTrigger>

			<DropdownMenuContent
				className="flex max-h-[500px] min-w-[180px] flex-col gap-0.5 overflow-y-auto"
				align="start"
			>
				<DropdownMenuItem
					disabled={isDisabled}
					onSelect={() => {
						setSidebar(ESidebar.FAR, true)
					}}
				>
					<Globe className="mr-2 size-5" />
					Localization
				</DropdownMenuItem>
				<DropdownMenuItem
					disabled={isDisabled}
					onSelect={() => {
						setSidebar(ESidebar.OUTLINE, true)
					}}
				>
					<Search className="mr-2 size-5" />
					Story Explorer
				</DropdownMenuItem>
				<DropdownMenuItem
					disabled={isDisabled}
					onSelect={() => {
						setFocusMode(true)
						setSidebar(null)
					}}
				>
					<Focus className="mr-2 size-5" />
					Focus Mode
				</DropdownMenuItem>
				<DropdownMenuItem
					disabled={isDisabled}
					onSelect={() => (isPending ? reset() : mutate())}
				>
					<IfElse condition={isPending}>
						<If>
							<Ban className="mr-2 size-5" />
							Stop Speaking
						</If>
						<Else>
							<Mic className="mr-2 size-5" />
							Speak Out
						</Else>
					</IfElse>
				</DropdownMenuItem>
				<If condition={!!audioUrl}>
					<div className="flex px-2 py-1.5">
						<Button
							className="mr-2 size-5 rounded-full"
							onClick={handlePlayPause}
							variant="ghost"
							size="icon"
						>
							<IfElse condition={isPlaying} if={<Pause />} else={<Play />} />
						</Button>
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
				</If>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
