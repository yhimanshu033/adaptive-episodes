import React, { useEffect, useMemo } from 'react'
import { BASE_EXTENSION_QUERY_KEY } from '@/constants/query-constants'
import useSocketStreaming from '@/hooks/use-socket-streaming'
import ChevronDownIcon from '@/icons/chevron-down-icon'
import { useQueryClient } from '@tanstack/react-query'
import { CheckCircle, Loader2 } from 'lucide-react'

import { IconButton } from '@/components/aural-ui/icon-button'
import IfElse, { Else, If } from '@/components/if-else'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'

type TBaseStatus = {
	header: string
	message: string
}

const BaseScriptStatus = ({
	taskId,
	reset,
}: {
	reset: () => void
	taskId: string
}) => {
	const { responses, taskEnded } = useSocketStreaming()
	const queryClient = useQueryClient()

	const grouped = useMemo(() => {
		return (
			responses[taskId]?.reduce<Record<string, string[]>>((acc, status) => {
				const { header, message } = JSON.parse(status) as TBaseStatus
				if (!acc[header]) {
					acc[header] = []
				}
				acc[header].push(message)
				return acc
			}, {}) || {
				'Extension Started': ['Live Status will be shown here'],
			}
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
		<div className="border-fm-divider-primary w-full border p-4 shadow-xs">
			<ScrollArea className="h-48 pr-2">
				<div ref={scrollRef} className="h-full overflow-y-auto pr-2">
					{Object.entries(grouped).map(([header, messages]) => (
						<div key={header} className="mb-4">
							<div className="mb-1 text-sm font-medium">{header}</div>
							<ul className="space-y-1 pl-4">
								{messages.map((msg, idx) => (
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
					))}
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
	)
}

export default BaseScriptStatus
