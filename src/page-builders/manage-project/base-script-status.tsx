import React, { useEffect, useMemo } from 'react'
import { BASE_EXTENSION_QUERY_KEY } from '@/constants/query-constants'
import useSocketStreaming from '@/hooks/use-socket-streaming'
import { AlertIcon } from '@/icons/alert-icon'
import ChevronDownIcon from '@/icons/chevron-down-icon'
import { CircleTickIcon } from '@/icons/circle-tick-icon'
import { useQueryClient } from '@tanstack/react-query'
import { CheckCircle, Loader2 } from 'lucide-react'

import Banner from '@/components/aural-ui/banner'
import { IconButton } from '@/components/aural-ui/icon-button'
import { Typography } from '@/components/aural-ui/typography'
import IfElse, { Else, If } from '@/components/if-else'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { formatDate } from '@/lib/format-date'

import { TBSEStatusBase } from '@/types/admin-types'

const BaseScriptStatus = ({
	taskId,
	reset,
	status,
}: {
	reset: () => void
	status: string
	taskId: string
}) => {
	const { responses, taskEnded } = useSocketStreaming()
	const queryClient = useQueryClient()

	const statuses = useMemo(() => {
		return responses[taskId] || []
	}, [responses, taskId])

	const scrollRef = React.useRef<HTMLDivElement>(null)

	const handleBack = async () => {
		reset()
		await queryClient.invalidateQueries({
			queryKey: [BASE_EXTENSION_QUERY_KEY],
		})
	}

	useEffect(() => {
		if (scrollRef.current) {
			scrollRef.current.scrollTo({
				top: scrollRef.current.scrollHeight,
				behavior: 'smooth',
			})
		}
	}, [responses])

	return (
		<div className="border-fm-divider-primary w-full border p-4 shadow-xs">
			<ScrollArea className="h-48 pr-2">
				<div ref={scrollRef} className="h-full overflow-y-auto pr-2">
					<ul className="space-y-1 pl-4">
						{statuses?.map((msg, idx) => (
							<li
								key={idx}
								className="text-muted-foreground flex items-center space-x-2 text-sm"
							>
								<CheckCircle className="text-success size-4" />
								<span>{msg}</span>
							</li>
						))}
					</ul>
				</div>
				<ScrollBar orientation="vertical" />
			</ScrollArea>

			<IfElse condition={taskEnded?.[taskId]}>
				<If>
					<div className="text-success relative flex items-center justify-center space-x-2 pt-4 text-sm">
						<CheckCircle className="size-4" />
						<span>Task Completed</span>

						<IconButton
							label="Back"
							shape="square"
							variant="outlined"
							size="small"
							onClick={() => void handleBack()}
							icon={<ChevronDownIcon className="h-4 w-4 rotate-90" />}
						/>
					</div>
				</If>
				<Else>
					<div className="text-muted-foreground flex animate-pulse items-center justify-center space-x-2 pt-4 text-sm">
						<Loader2 className="size-4 animate-spin" />
						<span>Processing…</span>
					</div>
				</Else>
			</IfElse>
			<If condition={!!status}>
				<Banner
					variant="warning"
					appearance="outlined"
					heading={status}
					paragraph={`Task ID: ${taskId}`}
					leftIcon={<AlertIcon className="size-4" />}
				/>
			</If>
		</div>
	)
}

type BaseScriptPreviousStatusProps = TBSEStatusBase & {
	previous_task_id: string | null
}

export const BaseScriptPreviousStatus = ({
	statusData,
}: {
	statusData: BaseScriptPreviousStatusProps | null
}) => {
	if (!statusData?.message) {
		return null
	}

	const isSuccess = statusData?.status === 'success'

	return (
		<Banner
			variant="warning"
			appearance="outlined"
			heading={
				<Typography
					variant="caption-large"
					className="!text-fm-warning-sec mb-2"
				>
					{statusData.message}
				</Typography>
			}
			paragraph={
				<>
					<Typography variant="caption-medium">
						Previous task ID: {statusData?.previous_task_id ?? 'Not available'}
					</Typography>
					<Typography variant="caption-medium">
						{formatDate(statusData?.timestamp ?? '', true)}
					</Typography>
				</>
			}
			leftIcon={
				isSuccess ? (
					<CircleTickIcon className="mt-0.5 size-4" />
				) : (
					<AlertIcon className="mt-0.5 size-4" />
				)
			}
		/>
	)
}

export default BaseScriptStatus
