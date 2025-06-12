import React from 'react'
import { CrossIcon } from '@/icons/cross-icon'
import useAIStore from '@/store/ai-store'

import { IconButton } from '@/components/aural-ui/icon-button'
import { Else, If, IfElse } from '@/components/aural-ui/if-else'
import { ScrollArea } from '@/components/aural-ui/scroll-area'
import { Typography } from '@/components/aural-ui/typography'
import { Loader } from '@/components/loader'

import { PlotExplorerApiResponse } from '@/types/ai-types'

import { StoryAccordion } from './story-accordion'

const Content = ({
	header,
	explorerData,
	isLoading,
	enableNote,
	start,
	end,
}: {
	enableNote?: boolean
	end: number
	explorerData?: PlotExplorerApiResponse['data']
	header: string
	isLoading: boolean
	start: number
}) => {
	const { store, setActiveExplorerActions } = useAIStore()
	const activeExplorerMode = store((state) => state.activeExplorerMode)

	return (
		<div className="bg-fm-surface-primary absolute inset-0 -top-14 z-50">
			<div className="border-fm-divider-tertiary bg-fm-surface-primary sticky top-0 z-51 mb-4 flex h-14 items-center justify-between gap-2 border py-3 pr-4 pl-7">
				<Typography align="left" color="primary" variant="body-small">
					{header}
				</Typography>
				<IconButton
					label="Close Sidebar"
					variant="ghost"
					onClick={() => {
						setActiveExplorerActions(activeExplorerMode, null)
					}}
					className="hover:bg-transparent"
					icon={<CrossIcon className="size-4" />}
				/>
			</div>
			<IfElse condition={!!explorerData?.length && !isLoading}>
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
					<div className="flex h-full w-full items-center justify-center">
						<Loader />
					</div>
				</Else>
			</IfElse>
		</div>
	)
}

export default Content
