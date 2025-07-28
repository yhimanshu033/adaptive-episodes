import React from 'react'
import Link from 'next/link'
import { FAR_FILTER_OPTIONS } from '@/constants/editor-constants'
import { ArrowRightUpIcon } from '@/icons/arrow-right-up-icon'
import { FilterBarRowIcon } from '@/icons/filter-bar-row-icon'

import { Checkbox } from '@/components/aural-ui/checkbox'
import { Divider } from '@/components/aural-ui/divider'
import { IconButton } from '@/components/aural-ui/icon-button'
import { If } from '@/components/aural-ui/if-else'
import Label from '@/components/aural-ui/label'
import { List, ListItem } from '@/components/aural-ui/list'
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/aural-ui/popover'
import { Typography } from '@/components/aural-ui/typography'

import { IFindAndReplaceUIProps } from './far'

type FarFilterDropdownProps = Pick<
	IFindAndReplaceUIProps,
	'sheetURL' | 'isWriter'
> & {
	value: Pick<
		IFindAndReplaceUIProps,
		'caseSensitive' | 'wholeWord' | 'toggleSearchMode'
	>
}

const FarFilterDropdown = ({
	sheetURL = '',
	isWriter,
	value,
}: FarFilterDropdownProps) => {
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
			<PopoverContent align="end" className="w-auto max-w-60 backdrop-blur-xs">
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
					<If condition={Boolean(sheetURL) && isWriter}>
						<Divider variant="dashed" />
						<ListItem className="p-0">
							<Link
								href={sheetURL}
								target="_blank"
								rel="noopener noreferrer"
								className="flex w-full items-center justify-between gap-2 p-4"
							>
								<Typography as="span" variant="body-medium">
									Open LOC sheet
								</Typography>
								<ArrowRightUpIcon />
							</Link>
						</ListItem>
					</If>
				</List>
			</PopoverContent>
		</Popover>
	)
}

export default FarFilterDropdown
