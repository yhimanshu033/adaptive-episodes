import React from 'react'
import useSaveEpisode from '@/hooks/use-save-episode'
import useAIStore from '@/store/ai-store'
import useEpisodeIdStore from '@/store/episode-id-store'
import { ArrowLeft, FilePlus2 } from 'lucide-react'
import { nanoid } from 'nanoid'
import { toast } from 'sonner'
import { useShallow } from 'zustand/react/shallow'

import { IconLoader, Loader } from '@/components/loader'
import { StoryAccordion } from '@/components/render-content'
import { Button } from '@/components/ui/button'
import { toPascalCase } from '@/lib/utils/helpers'

import { PlotExplorerApiResponse } from '@/types/ai-types'
import { TNote } from '@/types/plate-types'

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
	const { addNote } = useEpisodeIdStore()
	const activeExplorerMode = store((state) => state.activeExplorerMode)
	const activeExplorerActions = store(
		useShallow((state) => state.activeExplorerActions)
	)
	const { isPending } = useSaveEpisode()

	const addToNote = (explorerData?: PlotExplorerApiResponse['data']) => {
		const note: TNote = {
			id: nanoid(),
			title: `${toPascalCase(activeExplorerMode)} ${toPascalCase(activeExplorerActions[activeExplorerMode])} (Episode ${start} - ${end})`,
			content: explorerData || '',
			updateTime: new Date().toString(),
		}
		addNote(note)
		toast.success('Added to note successfully!')
	}
	return (
		<>
			<div className="mb-4 flex items-center justify-between gap-2">
				<h1 className="flex-1 text-xl font-bold">{header}</h1>
				{isPending ? (
					<IconLoader />
				) : (
					<Button
						variant="ghost"
						size="icon"
						tooltip="Add to Note"
						onClick={() => addToNote(explorerData)}
						disabled={enableNote === false}
					>
						<FilePlus2 size={16} />
					</Button>
				)}

				<Button
					variant="outline"
					size="icon"
					tooltip="Back"
					onClick={() => {
						setActiveExplorerActions(activeExplorerMode, null)
					}}
				>
					<ArrowLeft size={16} />
				</Button>
			</div>
			{explorerData?.length && !isLoading ? (
				<StoryAccordion explorerData={explorerData} />
			) : (
				<div className="mt-5 flex w-full justify-center">
					<Loader />
				</div>
			)}
		</>
	)
}

export default Content
