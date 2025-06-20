import React from 'react'
import { FAR_FILTER_OPTIONS } from '@/constants/editor-constants'
import useFindAndReplace from '@/hooks/use-find-and-replace'
import { FilterBarRowIcon } from '@/icons/filter-bar-row-icon'

import { Checkbox } from '@/components/aural-ui/checkbox'
import { IconButton } from '@/components/aural-ui/icon-button'
import Label from '@/components/aural-ui/label'
import { List, ListItem } from '@/components/aural-ui/list'
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/aural-ui/popover'

const FarFilterDropdown = () => {
	const value = useFindAndReplace()

	return (
		<Popover>
			<PopoverTrigger asChild>
				<IconButton
					label="Filter"
					variant="ghost"
					size="small"
					className="data-[state=open]:bg-fm-button-shadow-secondary"
					icon={<FilterBarRowIcon className="size-4" />}
					shape="square"
				/>
			</PopoverTrigger>
			<PopoverContent align="end" className="w-auto min-w-50">
				<List className="bg-transparent">
					{FAR_FILTER_OPTIONS.map(({ label, type, key }) => (
						<ListItem key={key} className="py-0">
							<Checkbox
								id={type}
								className="size-6 rounded-[6px]"
								checked={Boolean(value?.[key as keyof typeof value])}
								value={value?.[key as keyof typeof value] ? 'on' : 'off'}
								onCheckedChange={() => {
									value?.toggleSearchMode(type)
								}}
							/>
							<Label
								htmlFor={type}
								className="font-fm-text flex flex-1 items-center py-4 [font-size:var(--text-fm-lg)] normal-case"
							>
								{label}
							</Label>
						</ListItem>
					))}
				</List>
			</PopoverContent>
		</Popover>
	)
}

export default FarFilterDropdown
