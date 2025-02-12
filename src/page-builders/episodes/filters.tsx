import React from 'react'
import useEpisodeTable from '@/hooks/use-episode-table'
import { usePageState } from '@/hooks/use-page-state'
import { Table } from '@tanstack/react-table'
import { Merge, Search, Split } from 'lucide-react'
import { useForm } from 'react-hook-form'

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

const Filters = ({ table }: { table: Table<TEpisode> }) => {
	const { handleMerge, handleUnmerge } = useEpisodeTable()
	const { setSearch, setCurrentPage } = usePageState()

	const selectedRowModel = table.getSelectedRowModel().rows
	const selectedRowData = selectedRowModel.map((row) => row.original)

	const handleSearch = (data: TEpisodeSearchForm) => {
		void setSearch(data.input)
		void setCurrentPage(1)
	}

	const form = useForm<TEpisodeSearchForm>({
		defaultValues: {
			input: '',
		},
	})

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
			<Button
				size="icon"
				disabled={Object.keys(selectedRowData).length <= 1}
				onClick={() => handleMerge(selectedRowData)}
				title="Merge episodes"
			>
				<Merge size={16} />
			</Button>
			<Button
				size="icon"
				disabled={selectedRowData.length !== 1}
				onClick={() => handleUnmerge(selectedRowModel)}
				title="Unmerge episodes"
			>
				<Split size={16} />
			</Button>
		</>
	)
}

export default Filters
