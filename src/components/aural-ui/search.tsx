import React, { useCallback, useRef, useState } from 'react'

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
	disabled?: boolean
	initialValue?: string
	onChange?: (value: string) => void
	// Children can be used to render custom search results
	onEnterPressed?: (value: string) => void
	// Add value prop for controlled component
	onSearch?: (query: string) => void
	placeholder?: string
	// Add onChange for controlled component
	results?: SearchResult[]
	value?: string
}

export const Search = React.forwardRef<HTMLDivElement, SearchProps>(
	(
		{
			placeholder = 'Search episodes',
			className = '',
			value: controlledValue,
			onSearch,
			onChange,
			results = [],
			initialValue = '',
			children, // Children can be used to render custom search results
			onEnterPressed = () => {},
			disabled = false,
		},
		ref
	) => {
		// Determine if component is controlled or uncontrolled
		const isControlled = controlledValue !== undefined
		const [internalValue, setInternalValue] = useState(initialValue)
		const [isFocused, setIsFocused] = useState(false)
		const searchRef = useRef<HTMLDivElement>(null)

		// Use controlled value if provided, otherwise use internal state
		const value = isControlled ? controlledValue : internalValue

		const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
			const query = e.target.value

			// Update internal state only if uncontrolled
			if (!isControlled) {
				setInternalValue(query)
			}

			// Call onChange if provided (for controlled components)
			if (onChange) {
				onChange(query)
			}

			// Call onSearch if provided
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
				const newValue = ''

				// Update internal state only if uncontrolled
				if (!isControlled) {
					setInternalValue(newValue)
				}

				// Call onChange if provided (for controlled components)
				if (onChange) {
					onChange(newValue)
				}

				// Call onSearch if provided
				if (onSearch) {
					onSearch(newValue)
				}
			}
		}

		const handleKeyPress = useCallback(
			(e: React.KeyboardEvent<HTMLInputElement>) => {
				if (e.key === 'Enter') {
					onEnterPressed(internalValue)
					if (!isControlled) {
						setInternalValue('')
					}

					// Call onChange if provided (for controlled components)
					if (onChange) {
						onChange('')
					}

					// Call onSearch if provided
					if (onSearch) {
						onSearch('')
					}
				}
			},
			[internalValue, onEnterPressed, isControlled, onSearch, onChange]
		)

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
					onKeyDown={handleKeyPress}
					className="w-full rounded-full"
					decoration="filled"
					classes={{
						input: 'rounded-full h-11',
						wrapper: 'mt-0',
					}}
					disabled={disabled}
				/>

				{/* Search Results */}
				{isFocused && results.length > 0 && children}
			</div>
		)
	}
)

Search.displayName = 'Search'

export default Search
