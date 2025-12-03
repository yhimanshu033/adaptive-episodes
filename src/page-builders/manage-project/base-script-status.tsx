import React, { useEffect, useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { BASE_EXTENSION_QUERY_KEY } from '@/constants/query-constants'
import useSocketStreaming from '@/hooks/use-socket-streaming'
import { AlertIcon } from '@/icons/alert-icon'
import ArrowRightIcon from '@/icons/arrow-right-icon'
import ChevronDownIcon from '@/icons/chevron-down-icon'
import { CircleTickIcon } from '@/icons/circle-tick-icon'
import { CopyIcon } from '@/icons/copy-icon'
import { useQueryClient } from '@tanstack/react-query'
import { CheckCircle, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

import Badge from '@/components/aural-ui/badge'
import Banner from '@/components/aural-ui/banner'
import { Button } from '@/components/aural-ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/aural-ui/card'
import { IconButton } from '@/components/aural-ui/icon-button'
import { Typography } from '@/components/aural-ui/typography'
import IfElse, { Else, If } from '@/components/if-else'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { formatDate } from '@/lib/format-date'
import { parseIfJson } from '@/lib/utils/helpers'

import { TBSEStatusBase } from '@/types/admin-types'

const BaseScriptStatus = ({
	taskId = '',
	reset,
	storyId,
}: {
	reset: () => void
	storyId?: number
	taskId?: string
}) => {
	const { responses, taskEnded } = useSocketStreaming()
	const queryClient = useQueryClient()
	const { id } = useParams()
	const router = useRouter()

	const isDifferentStory = storyId && storyId !== Number(id)

	const statuses = useMemo(() => {
		return (
			responses[taskId]?.map((response) => {
				const parsedResponse = parseIfJson(response)
				if (!parsedResponse) {
					return ''
				}
				return typeof parsedResponse === 'object'
					? (parsedResponse as { message: string }).message
					: parsedResponse
			}) ?? []
		)
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
		<IfElse condition={!!isDifferentStory}>
			<If>
				<Card className="!w-full">
					<CardHeader className="space-y-4">
						<div className="flex flex-wrap items-center gap-3">
							<AlertIcon className="text-fm-warning-sec size-6" />
							<div>
								<CardTitle className="text-base font-semibold">
									Adaptation already running
								</CardTitle>
								<Typography
									variant="caption-medium"
									className="!text-fm-warning-sec/80"
								>
									Project ID #{storyId}
								</Typography>
							</div>
						</div>
						<CardDescription className="text-fm-warning-sec/80">
							Project ID {storyId} is currently under adaptation. You can
							continue only after the adaptation finishes or is discarded.
						</CardDescription>
					</CardHeader>
					<CardContent className="flex w-full items-center justify-center">
						<Button
							variant="secondary"
							noise="low"
							size="sm"
							className="w-full"
							rightIcon={<ArrowRightIcon className="size-3" />}
							onClick={() => router.push(`/projects/${storyId}`)}
						>
							Go to project
						</Button>
					</CardContent>
				</Card>
			</If>
			<Else>
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
				</div>
			</Else>
		</IfElse>
	)
}

type BaseScriptStatusBannerProps = TBSEStatusBase & {
	task_id: string | null
}

export const BaseScriptStatusBanner = ({
	statusData,
}: {
	statusData: BaseScriptStatusBannerProps | null
}) => {
	if (!statusData) {
		return null
	}

	const isSuccess = statusData.status === 'success'
	const message = statusData.message?.trim() || 'No status message available.'
	const formattedTimestamp = statusData.timestamp
		? formatDate(statusData.timestamp, true)
		: null
	const bannerVariant = isSuccess ? 'positive' : 'warning'

	const handleCopyTaskId = () => {
		void navigator.clipboard.writeText(statusData.task_id || 'N/A')
		toast.success('Task ID copied to clipboard')
	}

	return (
		<Banner
			variant={bannerVariant}
			appearance="outlined"
			heading={
				<Typography
					variant="caption-large"
					className={
						isSuccess ? '!text-fm-positive-sec' : '!text-fm-warning-sec'
					}
				>
					{message}
				</Typography>
			}
			paragraph={
				<div className="space-y-3">
					{formattedTimestamp && (
						<Typography variant="caption-medium">
							Last updated: {formattedTimestamp}
						</Typography>
					)}
					{statusData.task_id && (
						<div className="cursor-pointer" onClick={handleCopyTaskId}>
							<Typography as={'span'} variant="caption-medium" className="mr-1">
								Task ID:
							</Typography>
							<Badge size="sm">
								{statusData.task_id} <CopyIcon className="size-3" />
							</Badge>
						</div>
					)}
				</div>
			}
			leftIcon={
				isSuccess ? (
					<CircleTickIcon className="size-5" />
				) : (
					<AlertIcon className="size-5" />
				)
			}
		/>
	)
}

export default BaseScriptStatus
