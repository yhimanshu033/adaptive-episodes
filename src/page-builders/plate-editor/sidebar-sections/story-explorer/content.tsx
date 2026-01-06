import React, { useMemo } from 'react'
import { AlertIcon } from '@/icons/alert-icon'
import { CrossIcon } from '@/icons/cross-icon'
import useAIStore from '@/store/ai-store'

import { Button } from '@/components/aural-ui/button'
import DotLoader from '@/components/aural-ui/dot-loader'
import { IconButton } from '@/components/aural-ui/icon-button'
import { Else, If, IfElse } from '@/components/aural-ui/if-else'
import { ScrollArea } from '@/components/aural-ui/scroll-area'
import { Typography } from '@/components/aural-ui/typography'

import { PlotExplorerApiResponse } from '@/types/ai-types'

import { StoryAccordion } from './story-accordion'

const Content = ({
	header,
	explorerData,
	isLoading,
	isTimedOut,
	enableNote,
	start,
	end,
	refetch,
	getTimeLeft,
	taskId,
}: {
	enableNote?: boolean
	end: number
	explorerData?: PlotExplorerApiResponse['data']
	getTimeLeft?: (id?: string) => number
	header: string
	isLoading: boolean
	isTimedOut?: boolean
	refetch: () => void
	start: number
	taskId?: string
}) => {
	const { store, setActiveExplorerActions } = useAIStore()
	const activeExplorerMode = store((state) => state.activeExplorerMode)

	const timeLeft = useMemo(() => {
		return getTimeLeft ? getTimeLeft(taskId) : 0
	}, [getTimeLeft, taskId])

	const timeLeftText = useMemo(() => {
		if (!isTimedOut && timeLeft > 0) {
			const seconds = Math.ceil(timeLeft / 1000)
			return ` (${seconds}s remaining)`
		}
		return ''
	}, [isTimedOut, timeLeft])

	return (
		<div className="bg-fm-surface-primary absolute inset-x-0 -top-15.5 z-21 flex min-h-full flex-col">
			<div className="border-fm-divider-tertiary bg-fm-surface-primary sticky top-0 z-22 mb-4 flex h-15.5 items-center justify-between gap-2 border-y py-3 pr-4 pl-7">
				<Typography align="left" color="primary" variant="body-small">
					{header}
				</Typography>
				<IconButton
					label="Close Sidebar"
					variant="ghost"
					onClick={() => {
						setActiveExplorerActions(activeExplorerMode, null)
					}}
					shape="square"
					size="small"
					icon={<CrossIcon className="size-4" />}
				/>
			</div>
			<IfElse condition={!!explorerData?.length && !isLoading && !isTimedOut}>
				<If>
					<ScrollArea className="flex-1 transition-all duration-200">
						<StoryAccordion
							explorerData={explorerData || []}
							enableNote={enableNote}
							start={start}
							end={end}
						/>
					</ScrollArea>
				</If>
				<Else>
					<IfElse condition={!!isTimedOut}>
						<If>
							<div className="flex w-full flex-1 flex-col items-center justify-center gap-6 px-6">
								<div className="flex flex-col items-center gap-4">
									<AlertIcon className="text-fm-warning-sec h-10 w-10" />
									<Typography
										align="center"
										variant="body-large"
										className="text-fm-warning-sec"
									>
										Request Timed Out. Please try again.
									</Typography>
								</div>
								<Button variant="outline" onClick={() => refetch()}>
									Retry
								</Button>
							</div>
						</If>
						<Else>
							<div className="flex w-full flex-1 flex-col items-center justify-center gap-4">
								<DotLoader />
								<Typography color="tertiary" align="center" className="px-5">
									Just a moment, we&apos;re generating your content
									{timeLeftText}
								</Typography>
							</div>
						</Else>
					</IfElse>
				</Else>
			</IfElse>
		</div>
	)
}

export default Content
