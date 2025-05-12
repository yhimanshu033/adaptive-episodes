import React, { useMemo } from 'react'
import { useParams } from 'next/navigation'
import {
	GLOBAL_LOCALIZE,
	HIDE_HEADER,
	SIMPLIFIED_VIEWABLE_EDITOR,
} from '@/constants/global-constants'
import useEpisodeTable from '@/hooks/use-episode-table'
import useParentLanguage from '@/hooks/use-parent-language'
import MultiEpLocalizeDialog from '@/page-builders/episodes/dialogs/multi-ep-localize-dialog'
import { Table } from '@tanstack/react-table'
import { Languages, Merge, Replace, Split, X } from 'lucide-react'

import { If } from '@/components/if-else'
import { Button } from '@/components/ui/button'
import useAdaptation from '@/providers/adaptation-provider'
import useProjectId from '@/providers/project-id-provider'

import { ELanguage } from '@/types/common'
import { TEpisode } from '@/types/episode-type'

export default function SelectionActions({
	table,
}: {
	table: Table<TEpisode>
}) {
	const { isWriter } = useProjectId()
	const language = useParentLanguage()

	const selectedRowModel = table.getSelectedRowModel().rows
	const selectedRowData = selectedRowModel.map((row) => row.original)

	const { handleMerge, handleUnmerge } = useEpisodeTable()

	const { id } = useParams()

	const url = useMemo(() => {
		const episodeId = selectedRowData[0]?.id
		const extended = selectedRowData.map((episode) => episode.id).join(',')

		return `/projects/${String(id)}/${episodeId}/editor?extend=${extended}&${SIMPLIFIED_VIEWABLE_EDITOR}=true&${GLOBAL_LOCALIZE}=true&${HIDE_HEADER}=true`
	}, [selectedRowData, id])

	const {
		setSelectedRowData,
		setOpen,
		selectedRowData: adaptationData,
	} = useAdaptation()

	if (!isWriter || selectedRowData.length < 1) {
		return null
	}

	return (
		<div className="flex items-center justify-between gap-3">
			<div className="flex items-center gap-3">
				<Button
					size="icon"
					variant="ghost"
					onClick={() => table.resetRowSelection()}
				>
					<X className="size-6" />
				</Button>
				<h4>{selectedRowData.length} Episodes selected</h4>
			</div>
			<div className="flex gap-3">
				<If condition={language !== ELanguage.GERMAN_ORIGINAL}>
					<Button
						disabled={Object.keys(selectedRowData).length < 1}
						onClick={() => {
							if (adaptationData.length === 0) {
								setSelectedRowData(selectedRowData)
							}
							setOpen(true)
						}}
						size="icon"
						tooltip="Adapt episodes"
					>
						<Languages size={16} />
					</Button>
				</If>
				<MultiEpLocalizeDialog
					url={url}
					size="icon"
					disabled={Object.keys(selectedRowData).length <= 1}
					tooltip="Localize episodes"
				>
					<Replace size={16} />
				</MultiEpLocalizeDialog>
				<If condition={!language || language === ELanguage.GERMAN_ORIGINAL}>
					<Button
						size="icon"
						disabled={Object.keys(selectedRowData).length <= 1}
						onClick={() => handleMerge(selectedRowData)}
						tooltip="Merge episodes"
					>
						<Merge size={16} />
					</Button>
					<Button
						size="icon"
						disabled={selectedRowData.length !== 1}
						onClick={() => handleUnmerge(selectedRowModel)}
						tooltip="Unmerge episodes"
					>
						<Split size={16} />
					</Button>
				</If>
			</div>
		</div>
	)
}
