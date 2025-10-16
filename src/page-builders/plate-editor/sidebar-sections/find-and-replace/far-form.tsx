import React from 'react'
import {
	FAR_FILTER_OPTIONS,
	farSearchModes,
} from '@/constants/editor-constants'
import ArrowRightIcon from '@/icons/arrow-right-icon'
import { CrossIcon } from '@/icons/cross-icon'
import { SearchIcon } from '@/icons/search-icon'

import { Button } from '@/components/aural-ui/button'
import { If } from '@/components/aural-ui/if-else'
import Input from '@/components/aural-ui/input'

import AddFormPopover from './add-form-popover'
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
	| 'caseSensitive'
	| 'wholeWord'
	| 'toggleSearchMode'
	| 'setData'
	| 'replaceEnabled'
>

const FindAndReplaceForm = ({
	search,
	replace,
	isWriter,
	caseSensitive,
	wholeWord,
	onReplaceChange,
	handleSearchChange,
	onReplace,
	onReplaceAll,
	toggleSearchMode,
	setData,
	replaceEnabled,
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
				<If condition={caseSensitive || wholeWord}>
					<div className="flex items-center gap-2">
						{FAR_FILTER_OPTIONS.map((option) => {
							if (
								option.type === farSearchModes.CASE_SENSITIVE &&
								!caseSensitive
							) {
								return null
							}
							if (option.type === farSearchModes.WHOLE_WORD && !wholeWord) {
								return null
							}
							return (
								<Button
									key={option.type}
									variant="outline"
									size="sm"
									innerClassName="border-fm-divider-secondary bg-transparent translate-y-0"
									rightIcon={
										<CrossIcon
											className="size-4"
											onClick={() => toggleSearchMode(option.type)}
										/>
									}
								>
									{option.label}
								</Button>
							)
						})}
					</div>
				</If>
				<If condition={isWriter}>
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
				</If>
			</div>
			<If condition={isWriter}>
				<div className="flex items-center justify-between gap-2">
					<AddFormPopover
						isWriter={isWriter}
						search={search}
						replace={replace}
						setData={setData}
					/>
					<Button
						variant="outline"
						size="sm"
						className="flex-1"
						disabled={!search || !replace || !replaceEnabled}
						isDisabled={!search || !replace || !replaceEnabled}
						innerClassName="border-fm-divider-secondary bg-transparent group-disabled:text-fm-tertiary translate-y-0 group-hover:text-fm-primary group-hover:border-fm-divider-contrast group-disabled:border-fm-divider-secondary"
						onClick={onReplace}
					>
						Replace
					</Button>
					<Button
						variant="outline"
						size="sm"
						className="flex-1"
						disabled={!search || !replace || !replaceEnabled}
						isDisabled={!search || !replace || !replaceEnabled}
						innerClassName="border-fm-divider-secondary bg-transparent group-disabled:text-fm-tertiary translate-y-0 group-hover:text-fm-primary group-hover:border-fm-divider-contrast group-disabled:border-fm-divider-secondary"
						onClick={onReplaceAll}
					>
						Replace all
					</Button>
				</div>
			</If>
		</section>
	)
}

export default FindAndReplaceForm
