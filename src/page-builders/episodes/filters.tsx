import React, { useEffect, useState } from 'react'
import useEpisodeTable from '@/hooks/use-episode-table'
import { usePageState } from '@/hooks/use-page-state'
import AdaptationDialog from '@/page-builders/episodes/adaptation-dialog'
import { Table } from '@tanstack/react-table'
import { Merge, Search, Split } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

import { TEpisode, TEpisodeSearchForm } from '@/types/episode-type'

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

	const selectedRowModel = table.getSelectedRowModel().rows
	const selectedRowData = selectedRowModel.map((row) => row.original)

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
		)
			return

		setFetchedSeqNumber(true)
		handleSearch({ input: String(seqNumber) })
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [seqNumber, totalEpisodes])

	const form = useForm<TEpisodeSearchForm>({
		defaultValues: {
			input: '',
		},
	})

	useEffect(() => {
		if (!search || search === form.getValues('input')) return

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
					<Button size="icon">
						<Search size={16} />
					</Button>
				</form>
			</Form>
			<AdaptationDialog
				disabled={disabled || Object.keys(selectedRowData).length <= 1}
				selectedRowData={selectedRowData}
			/>
			<Button
				size="icon"
				disabled={disabled || Object.keys(selectedRowData).length <= 1}
				onClick={() => handleMerge(selectedRowData)}
				title="Merge episodes"
			>
				<Merge size={16} />
			</Button>
			<Button
				size="icon"
				disabled={disabled || selectedRowData.length !== 1}
				onClick={() => handleUnmerge(selectedRowModel)}
				title="Unmerge episodes"
			>
				<Split size={16} />
			</Button>
		</>
	)
}

export default Filters
