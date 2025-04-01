import React, { useEffect, useState } from 'react'
import { useDebounceValue } from 'usehooks-ts'

import { Input } from '@/components/ui/input'

import AddMemberDialog from './add-member-dialog'

const SearchTable = ({
	setGlobalFilter,
}: {
	setGlobalFilter: React.Dispatch<React.SetStateAction<string>>
}) => {
	const [query, setQuery] = useState<string>('')
	const [debounceQuery] = useDebounceValue(query, 300)

	useEffect(() => {
		setGlobalFilter(debounceQuery)
	}, [debounceQuery, setGlobalFilter])

	return (
		<div className="flex items-center gap-2">
			<Input
				placeholder="Search Members"
				onChange={(e) => setQuery(e.target.value)}
			/>
			<AddMemberDialog />
		</div>
	)
}

export default SearchTable
