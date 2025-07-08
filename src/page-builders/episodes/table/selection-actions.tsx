import React, { useMemo } from 'react'
import { useParams } from 'next/navigation'
import {
	GLOBAL_LOCALIZE,
	HIDE_HEADER,
	SIMPLIFIED_VIEWABLE_EDITOR,
} from '@/constants/global-constants'
import useEpisodeTable from '@/hooks/use-episode-table'
import useParentLanguage from '@/hooks/use-parent-language'
import { CrossIcon } from '@/icons/cross-icon'
import { GitBranchIcon } from '@/icons/git-branch-icon'
import { GitForkIcon } from '@/icons/git-fork-icon'
import { MagicBookIcon } from '@/icons/magic-book-icon'
import MultiEpLocalizeDialog from '@/page-builders/episodes/dialogs/multi-ep-localize-dialog'
import { Table } from '@tanstack/react-table'
import { Replace } from 'lucide-react'

import { Button } from '@/components/aural-ui/button'
import { IconButton } from '@/components/aural-ui/icon-button'
import { If } from '@/components/if-else'
import useAdaptation from '@/providers/adaptation-provider'
import useEpisodeTableContext from '@/providers/episode-table-provider'
import useProjectId from '@/providers/project-id-provider'
import { cn } from '@/lib/aural-ui/utils'

import { ELanguage } from '@/types/common'
import { TEpisode } from '@/types/episode-type'

export default function SelectionActions({
	table,
}: {
	table: Table<TEpisode>
}) {
	const { isWriter } = useProjectId()
	const language = useParentLanguage()
	const { initialStoryData } = useEpisodeTableContext()

	const selectedRowModel = table.getSelectedRowModel().rows
	const selectedRowData = selectedRowModel.map((row) => row.original)

	const { handleMerge, handleUnmerge } = useEpisodeTable()

	const { id } = useParams()

	const url = useMemo(() => {
		const episodeId = selectedRowData[0]?.parent || selectedRowData[0]?.id
		const extended = selectedRowData
			.map((episode) => episode.parent || episode.id)
			.join(',')

		return `/projects/${String(id)}/${episodeId}/editor?extend=${extended}&${SIMPLIFIED_VIEWABLE_EDITOR}=true&${GLOBAL_LOCALIZE}=true&${HIDE_HEADER}=true`
	}, [selectedRowData, id])

	const {
		setSelectedRowData,
		setOpen,
		setStory,
		setEpisodeAdaptation,
		selectedRowData: adaptationData,
	} = useAdaptation()

	if (!isWriter || selectedRowData.length < 1) {
		return null
	}

	return (
		<div className="bg-fm-surface-primary mb-4 flex min-h-17 items-center justify-between gap-3 px-6 pr-4 pl-0">
			<div className="flex items-center gap-1 pl-1.5">
				<IconButton
					onClick={() => void table.resetRowSelection()}
					variant="ghost"
					icon={<CrossIcon width={20} height={20} />}
					label="cross selection icon"
					shape="square"
					size="small"
				/>
				<h4 className="font-fm-brand text-sm uppercase">
					{selectedRowData.length} Episodes selected
				</h4>
			</div>
			<div className="flex gap-3">
				<If condition={language.parentLanguage !== ELanguage.GERMAN_ORIGINAL}>
					<Button
						disabled={Object.keys(selectedRowData).length < 1}
						onClick={() => {
							if (adaptationData.length === 0) {
								setSelectedRowData(selectedRowData)
								setStory(initialStoryData)
								setEpisodeAdaptation(true)
							}
							setOpen(true)
						}}
						variant="outline"
						className="gap-2 rounded-3xl"
						innerClassName={cn('border-fm-divider-secondary h-9', {
							'border-fm-divider-tertiary !text-fm-icon-inactive':
								Object.keys(selectedRowData).length < 1,
						})}
						leftIcon={
							<MagicBookIcon
								className={cn('size-4', {
									'text-fm-icon-inactive':
										Object.keys(selectedRowData).length < 1,
								})}
							/>
						}
					>
						AI Adaptation
					</Button>
				</If>
				<MultiEpLocalizeDialog
					url={url}
					disabled={selectedRowData.length <= 1}
					tooltip="Multi Episode Localize"
					innerClassName={cn('border-fm-divider-secondary h-9', {
						'border-fm-divider-tertiary !text-fm-icon-inactive':
							selectedRowData.length <= 1,
					})}
				>
					<Replace size={16} />
				</MultiEpLocalizeDialog>
				<If
					condition={
						!language.parentLanguage ||
						language.parentLanguage === ELanguage.GERMAN_ORIGINAL
					}
				>
					<Button
						variant="outline"
						innerClassName={cn('border-fm-divider-secondary h-9', {
							'border-fm-divider-tertiary !text-fm-icon-inactive':
								Object.keys(selectedRowData).length <= 1,
						})}
						disabled={Object.keys(selectedRowData).length <= 1}
						onClick={() => handleMerge(selectedRowData)}
						leftIcon={
							<GitForkIcon
								className={cn('size-4', {
									'text-fm-icon-inactive':
										Object.keys(selectedRowData).length <= 1,
								})}
							/>
						}
					>
						Combine
					</Button>
					<Button
						variant="outline"
						disabled={
							selectedRowData.length !== 1 ||
							!selectedRowModel[0].getCanExpand()
						}
						onClick={() => handleUnmerge(selectedRowModel)}
						innerClassName={cn('border-fm-divider-secondary h-9', {
							'border-fm-divider-tertiary !text-fm-icon-inactive':
								selectedRowData.length !== 1 ||
								!selectedRowModel[0].getCanExpand(),
						})}
						leftIcon={
							<GitBranchIcon
								className={cn('text-fm-primary size-4', {
									'text-fm-icon-inactive':
										selectedRowData.length !== 1 ||
										!selectedRowModel[0].getCanExpand(),
								})}
							/>
						}
					>
						Separate
					</Button>
				</If>
			</div>
		</div>
	)
}
