import React from 'react'
import ArrowRightIcon from '@/icons/arrow-right-icon'
import { PlusIcon } from '@/icons/plus-icon'
import { SearchIcon } from '@/icons/search-icon'

import { Button } from '@/components/aural-ui/button'
import { If } from '@/components/aural-ui/if-else'
import Input from '@/components/aural-ui/input'

import { IFindAndReplaceUIProps } from './far'

type FindAndReplaceFormProps = Pick<
	IFindAndReplaceUIProps,
	| 'search'
	| 'replace'
	| 'onReplaceChange'
	| 'handleSearchChange'
	| 'isWriter'
	| 'onReplace'
	| 'onReplaceAll'
>

const FindAndReplaceForm = ({
	search,
	replace,
	isWriter,
	onReplaceChange,
	handleSearchChange,
	onReplace,
	onReplaceAll,
}: FindAndReplaceFormProps) => {
	return (
		<section className="border-fm-divider-tertiary space-y-5 border-b px-6 py-7">
			<div className="space-y-2">
				<Input
					startIcon={<SearchIcon />}
					placeholder="Find"
					decoration="filled"
					id="find-input"
					value={search}
					onChange={handleSearchChange}
					className="text-fm-icon-inactive focus-within:text-fm-icon-active"
					classes={{
						input: 'h-11',
					}}
				/>
				<Input
					startIcon={<ArrowRightIcon />}
					placeholder="Replace with..."
					decoration="filled"
					id="replce-with-input"
					value={replace}
					onChange={onReplaceChange}
					className="text-fm-icon-inactive focus-within:text-fm-icon-active"
					classes={{
						input: 'h-11',
					}}
				/>
			</div>
			<div className="flex items-center justify-between gap-2">
				<If condition={isWriter}>
					<Button
						variant="outline"
						size="sm"
						disabled={!search}
						isDisabled={!search}
						innerClassName="border-fm-divider-secondary bg-transparent group-disabled:text-fm-tertiary translate-y-0 group-hover:text-fm-primary group-hover:border-fm-divider-contrast group-disabled:border-fm-divider-secondary"
					>
						<PlusIcon className="size-4.5" />
					</Button>
				</If>
				<Button
					variant="outline"
					size="sm"
					className="flex-1"
					disabled={!search || !replace}
					isDisabled={!search || !replace}
					innerClassName="border-fm-divider-secondary bg-transparent group-disabled:text-fm-tertiary translate-y-0 group-hover:text-fm-primary group-hover:border-fm-divider-contrast group-disabled:border-fm-divider-secondary"
					onClick={onReplace}
				>
					Replace
				</Button>
				<Button
					variant="outline"
					size="sm"
					className="flex-1"
					disabled={!search || !replace}
					isDisabled={!search || !replace}
					innerClassName="border-fm-divider-secondary bg-transparent group-disabled:text-fm-tertiary translate-y-0 group-hover:text-fm-primary group-hover:border-fm-divider-contrast group-disabled:border-fm-divider-secondary"
					onClick={onReplaceAll}
				>
					Replace all
				</Button>
			</div>
		</section>
	)
}

export default FindAndReplaceForm
