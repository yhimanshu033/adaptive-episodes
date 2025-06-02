import React, { useRef, useState } from 'react'

import { CrossIcon } from '../../icons/cross-icon'
import { SearchIcon } from '../../icons/search-icon'
import { cn } from '../../lib/aural-ui/utils'
import { IconButton } from './icon-button'
import Input from './input'

export interface SearchResult {
	id: string
	text: string
}

export interface SearchProps {
	children?: React.ReactNode
	className?: string
	initialValue?: string
	onSearch?: (query: string) => void
	placeholder?: string
	results?: SearchResult[] // Children can be used to render custom search results
}

export const Search = React.forwardRef<HTMLDivElement, SearchProps>(
	(
		{
			placeholder = 'Search episodes',
			className = '',
			onSearch,
			results = [],
			initialValue = '',
			children, // Children can be used to render custom search results
		},
		ref
	) => {
		const [value, setValue] = useState(initialValue)
		const [isFocused, setIsFocused] = useState(false)
		const searchRef = useRef<HTMLDivElement>(null)

		const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
			const query = e.target.value
			setValue(query)
			if (onSearch) {
				onSearch(query)
			}
		}

		const handleClear = (e: React.MouseEvent, resultId?: string) => {
			e.stopPropagation()
			if (resultId) {
				// Only clear the specific result
				if (onSearch) {
					// Refresh search without the cleared result
					onSearch(value)
				}
			} else {
				// Clear the input
				setValue('')
				if (onSearch) {
					onSearch('')
				}
			}
		}

		return (
			<div
				ref={ref || searchRef}
				className={cn('flex w-full flex-col', className)}
			>
				{/* Search Input */}
				<Input
					placeholder={placeholder}
					value={value}
					onChange={handleChange}
					onFocus={() => setIsFocused(true)}
					onBlur={() => setIsFocused(false)}
					startIcon={
						<SearchIcon
							width={16}
							height={16}
							className="text-fm-icon-active"
						/>
					}
					endIcon={
						<IconButton
							variant="ghost"
							size="small"
							onClick={handleClear}
							className={cn({ hidden: !value })} // Hide if input is empty
							icon={<CrossIcon width={16} height={16} />}
							label="Clear search"
						/>
					}
					className="rounded-full"
					decoration="filled"
					classes={{
						input: 'rounded-full h-11',
						wrapper: 'mt-0',
					}}
				/>

				{/* Search Results */}
				{isFocused && results.length > 0 && children}
			</div>
		)
	}
)

Search.displayName = 'Search'

export default Search
