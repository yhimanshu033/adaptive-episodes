import React, { useEffect, useMemo, useState } from 'react'
import { useParams } from 'next/navigation'
import {
	GLOBAL_LOCALIZE,
	HIDE_HEADER,
	SIMPLIFIED_VIEWABLE_EDITOR,
} from '@/constants/global-constants'
import useAccessChecks from '@/hooks/use-access-checks'
import useEpisodeTable from '@/hooks/use-episode-table'
import { usePageState } from '@/hooks/use-page-state'
import { Table } from '@tanstack/react-table'
import { Languages, Merge, Replace, Search, Split } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { If } from '@/components/if-else'
import { Button } from '@/components/ui/button'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import useAdaptation from '@/providers/adaptation-provider'
import useEpisodeTableContext from '@/providers/episode-table-provider'

import { TEpisode, TEpisodeSearchForm } from '@/types/episode-type'

import MultiEpLocalizeDialog from './dialogs/multi-ep-localize-dialog'

const Filters = ({
	table,
	totalEpisodes = 0,
	setSearchedRow,
	disabled,
}: {
	disabled?: boolean
	setSearchedRow: React.Dispatch<React.SetStateAction<number | null>>
	table: Table<TEpisode>
	totalEpisodes?: number
}) => {
	const { handleMerge, handleUnmerge } = useEpisodeTable()
	const [fetchedSeqNumber, setFetchedSeqNumber] = useState<boolean>(false)
	const { limit, setSearch, setCurrentPage, search, seqNumber } = usePageState()
	const { id } = useParams()

	const selectedRowModel = table.getSelectedRowModel().rows
	const selectedRowData = selectedRowModel.map((row) => row.original)

	const { isGerman, isOriginal } = useAccessChecks()
	const { initialStoryData } = useEpisodeTableContext()

	const {
		setSelectedRowData,
		setStory,
		setOpen,
		selectedRowData: adaptationData,
		setEpisodeAdaptation,
	} = useAdaptation()

	const handleSearch = (data: TEpisodeSearchForm) => {
		if (Number(data.input)) {
			const input = Number(data.input)
			if (input > totalEpisodes) {
				toast.info('Total episodes exceeded', {
					description: `Please search within ${totalEpisodes} episodes`,
				})
				return
			} else if (input <= 0) {
				toast.info('Invalid input', {
					description: `Please enter a positive number`,
				})
				return
			}
			const page = Math.ceil(Number(input) / limit)
			const row = input % limit || limit
			void setSearch('')
			void setCurrentPage(page)
			setSearchedRow(row)
		} else {
			void setSearch(data.input)
			void setCurrentPage(1)
		}
	}

	useEffect(() => {
		if (
			fetchedSeqNumber ||
			!seqNumber ||
			String(seqNumber) === search ||
			totalEpisodes === 0
		) {
			return
		}

		setFetchedSeqNumber(true)
		handleSearch({ input: String(seqNumber) })
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [seqNumber, totalEpisodes])

	const form = useForm<TEpisodeSearchForm>({
		defaultValues: {
			input: '',
		},
	})

	const url = useMemo(() => {
		const episodeId = selectedRowData[0]?.parent || selectedRowData[0]?.id
		const extended = selectedRowData
			.map((episode) => episode.parent || episode.id)
			.join(',')

		return `/projects/${String(id)}/${episodeId}/editor?extend=${extended}&${SIMPLIFIED_VIEWABLE_EDITOR}=true&${GLOBAL_LOCALIZE}=true&${HIDE_HEADER}=true`
	}, [selectedRowData, id])

	useEffect(() => {
		if (!search || search === form.getValues('input')) {
			return
		}

		form.setValue('input', search)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [search])

	return (
		<>
			<Form {...form}>
				<form
					onSubmit={(e) => void form.handleSubmit(handleSearch)(e)}
					className="mb-2 flex flex-1 items-center gap-2"
				>
					<FormField
						control={form.control}
						name="input"
						render={({ field }) => (
							<FormItem className="flex-1">
								<FormControl>
									<Input placeholder="Search Episode" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<Button tooltip="Search" size="icon">
						<Search size={16} />
					</Button>
				</form>
			</Form>
			<If condition={!isGerman}>
				<Button
					disabled={disabled || selectedRowData.length < 1}
					onClick={() => {
						if (adaptationData.length === 0) {
							setStory(initialStoryData)
							setSelectedRowData(selectedRowData)
							setEpisodeAdaptation(true)
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
				size="sm"
				isDisabled={disabled || Object.keys(selectedRowData).length <= 1}
				disabled={disabled || Object.keys(selectedRowData).length <= 1}
				tooltip="Localize episodes"
			>
				<Replace size={18} />
			</MultiEpLocalizeDialog>
			<If condition={isGerman || isOriginal}>
				<Button
					size="icon"
					disabled={disabled || Object.keys(selectedRowData).length <= 1}
					onClick={() => handleMerge(selectedRowData)}
					tooltip="Merge episodes"
				>
					<Merge size={16} />
				</Button>
				<Button
					size="icon"
					disabled={disabled || selectedRowData.length !== 1}
					onClick={() => handleUnmerge(selectedRowModel)}
					tooltip="Unmerge episodes"
				>
					<Split size={16} />
				</Button>
			</If>
		</>
	)
}

export default Filters
