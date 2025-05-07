import React, { useEffect, useMemo } from 'react'
import { BASE_EXTENSION_QUERY_KEY } from '@/constants/query-constants'
import useSocketStreaming from '@/hooks/use-socket-streaming'
import { useQueryClient } from '@tanstack/react-query'
import { CheckCircle, ChevronLeft, Loader2 } from 'lucide-react'

import IfElse, { Else, If } from '@/components/if-else'
import { Button } from '@/components/ui/button'
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
				if (!acc[header]) acc[header] = []
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
		<div className="w-full rounded-md border p-4 shadow-sm">
			<ScrollArea className="h-48 pr-2">
				<div ref={scrollRef} className="h-full overflow-y-auto pr-2">
					{Object.entries(grouped).map(([header, messages]) => (
						<div key={header} className="mb-4">
							<div className="mb-1 text-sm font-medium">{header}</div>
							<ul className="space-y-1 pl-4">
								{messages.map((msg, idx) => (
									<li
										key={idx}
										className="flex items-center space-x-2 text-sm text-muted-foreground"
									>
										<CheckCircle className="size-4 text-success" />
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
					<div className="relative flex items-center justify-center space-x-2 pt-4 text-sm text-success">
						<CheckCircle className="size-4" />
						<span>Task Completed</span>
						<Button
							className="absolute right-0"
							variant="outline"
							size="icon"
							// eslint-disable-next-line @typescript-eslint/no-misused-promises
							onClick={handleBack}
						>
							<ChevronLeft size={16} />
						</Button>
					</div>
				</If>
				<Else>
					<div className="flex animate-pulse items-center justify-center space-x-2 pt-4 text-sm text-muted-foreground">
						<Loader2 className="size-4 animate-spin" />
						<span>Processing…</span>
					</div>
				</Else>
			</IfElse>
		</div>
	)
}

export default BaseScriptStatus
