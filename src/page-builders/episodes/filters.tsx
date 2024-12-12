import React, { useState } from 'react'
import useEpisodeTable from '@/hooks/use-episode-table'
import { setEpisodeSearch } from '@/store/episode-store'
import { Table } from '@tanstack/react-table'
import { Merge, Search, Split } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import { TEpisode } from '@/types/episode-type'

const Filters = ({ table }: { table: Table<TEpisode> }) => {
	const [episodeInput, setEpisodeInput] = useState<string>('')

	const { handleMerge, handleUnmerge } = useEpisodeTable()

	const selectedRowModel = table.getSelectedRowModel().rows
	const selectedRowData = selectedRowModel.map((row) => row.original)

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		setEpisodeSearch(episodeInput)
	}

	return (
		<>
			<form
				onSubmit={handleSubmit}
				className="mb-2 flex flex-1 items-center gap-2"
			>
				<Input
					placeholder="Search Episode"
					className="border"
					onChange={(e) => setEpisodeInput(e.target.value)}
				/>
				<Button type="submit" size="icon">
					<Search size={16} />
				</Button>
			</form>
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
