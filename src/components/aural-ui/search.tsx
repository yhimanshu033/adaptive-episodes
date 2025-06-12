import React, { useRef, useState } from "react"
import { IconButton } from "./icon-button"
import Input from "./input"
import { CrossIcon } from "../../icons/cross-icon"
import { SearchIcon } from "../../icons/search-icon"
import { cn } from "../../lib/aural-ui/utils"

export interface SearchResult {
  id: string
  text: string
}

export interface SearchProps {
  placeholder?: string
  className?: string
  value?: string // Add value prop for controlled component
  onSearch?: (query: string) => void
  onChange?: (value: string) => void // Add onChange for controlled component
  results?: SearchResult[]
  initialValue?: string
  children?: React.ReactNode // Children can be used to render custom search results
}

export const Search = React.forwardRef<HTMLDivElement, SearchProps>(
  (
    {
      placeholder = "Search episodes",
      className = "",
      value: controlledValue,
      onSearch,
      onChange,
      results = [],
      initialValue = "",
      children, // Children can be used to render custom search results
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
        const newValue = ""

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

    return (
      <div
        ref={ref || searchRef}
        className={cn("flex w-full flex-col", className)}
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
          className="w-full rounded-full"
          decoration="filled"
          classes={{
            input: "rounded-full h-11",
            wrapper: "mt-0",
          }}
        />

        {/* Search Results */}
        {isFocused && results.length > 0 && children}
      </div>
    )
  }
)

Search.displayName = "Search"

export default Search
