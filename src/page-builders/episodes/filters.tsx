import React, { useState } from 'react'
import { Search } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const Filters = ({
	setEpisodeFilter,
}: {
	setEpisodeFilter: (episode: string) => void
}) => {
	const [episodeSearch, setEpisodeSearch] = useState<string>('')

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		setEpisodeFilter(episodeSearch)
	}

	return (
		<form onSubmit={handleSubmit} className="mb-2 flex items-center gap-2">
			<Input
				placeholder="Search Episode"
				className="border"
				onChange={(e) => setEpisodeSearch(e.target.value)}
			/>
			<Button type="submit" size="icon">
				<Search size={16} />
			</Button>
		</form>
	)
}

export default Filters
