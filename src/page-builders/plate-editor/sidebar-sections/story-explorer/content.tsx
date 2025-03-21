import React from 'react'
import useNotesMutation from '@/hooks/mutation/use-notes-mutation'
import useNotes from '@/hooks/use-notes'
import useAIStore from '@/store/ai-store'
import { ArrowLeft, Copy, FilePlus2 } from 'lucide-react'
import { nanoid } from 'nanoid'
import { useShallow } from 'zustand/react/shallow'

import { IconLoader, Loader } from '@/components/loader'
import { StoryAccordion } from '@/components/render-content'
import { Button } from '@/components/ui/button'
import { formatExplorerData } from '@/lib/utils/explorer'
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
	const { handleAddNote } = useNotes()
	const activeExplorerMode = store((state) => state.activeExplorerMode)
	const activeExplorerActions = store(
		useShallow((state) => state.activeExplorerActions)
	)

	const updateNotesMutation = useNotesMutation()

	const addToNote = (explorerData?: PlotExplorerApiResponse['data']) => {
		const id = nanoid()
		const note: TNote = {
			id,
			title: `${toPascalCase(activeExplorerMode)} ${toPascalCase(activeExplorerActions[activeExplorerMode])} (Episode ${start} - ${end})`,
			content: explorerData || '',
			updateTime: new Date().toString(),
		}
		handleAddNote(note)
	}
	return (
		<>
			<div className="mb-4 flex items-center justify-between gap-2">
				<h1 className="flex-1 text-xl font-bold">{header}</h1>
				{enableNote !== false && (
					<Button
						variant="ghost"
						size="icon"
						tooltip="Copy"
						onClick={() =>
							void navigator.clipboard.writeText(
								formatExplorerData(explorerData || '')
							)
						}
					>
						<Copy size={16} />
					</Button>
				)}
				{updateNotesMutation.isPending ? (
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
