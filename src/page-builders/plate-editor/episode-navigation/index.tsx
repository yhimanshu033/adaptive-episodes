import React, { useCallback, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { SIMPLIFIED_VIEWABLE_EDITOR } from '@/constants/global-constants'
import { useInfiniteEpisodesData } from '@/hooks/query/use-episode-data'
import { Sidebar } from 'lucide-react'

import { Button } from '@/components/ui/button'
import ForEach from '@/components/ui/for-each'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils/helpers'

import { TGetEpisodesResponse } from '@/types/episode-type'

export default function EpisodeNavigation() {
	const [openNavigation, setOpenNavigation] = useState(false)
	const searchParams = useSearchParams()
	const simplifiedEditor = searchParams.get(SIMPLIFIED_VIEWABLE_EDITOR)

	const { InfiniteScrollWithDebouncing, data } = useInfiniteEpisodesData()

	const episodes = useMemo(
		() =>
			data.reduce(
				(acc, curr) => [...acc, ...(curr?.results?.data || [])],
				[] as TGetEpisodesResponse['results']['data']
			),
		[data]
	)

	const toggleOpenNavigation = useCallback(() => {
		setOpenNavigation((p) => !p)
	}, [setOpenNavigation])

	if (simplifiedEditor) {
		return null
	}
	return (
		<div className="relative">
			<Button
				className="absolute -right-5 top-0 z-10 rounded-full"
				variant="outline"
				size="icon"
				onClick={toggleOpenNavigation}
			>
				<Sidebar />
			</Button>
			<div
				className={cn(
					'~sticky top-0 text-clip transition-all',
					openNavigation ? 'w-48' : 'w-0'
				)}
			>
				<InfiniteScrollWithDebouncing
					className=""
					skeleton={<div>Loading...</div>}
				>
					<ScrollArea className="">
						<div className="flex flex-col">
							<ForEach data={episodes}>
								{(item, idx) => (
									<Button
										variant="ghost"
										className="h-auto py-4 text-left"
										key={idx}
									>
										EP {item.seq_number}
									</Button>
								)}
							</ForEach>
						</div>
					</ScrollArea>
				</InfiniteScrollWithDebouncing>
			</div>
		</div>
	)
}
