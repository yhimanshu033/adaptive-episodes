import React from 'react'
import ArrowRightIcon from '@/icons/arrow-right-icon'

import { IconButton } from '@/components/aural-ui/icon-button'
import { If } from '@/components/aural-ui/if-else'
import { Typography } from '@/components/aural-ui/typography'
import ForEach from '@/components/ui/for-each'

import { IFindAndReplaceUIProps } from './far'

type FindAndReplaceResultsProps = Pick<
	IFindAndReplaceUIProps,
	| 'search'
	| 'replace'
	| 'occurrences'
	| 'recordTexts'
	| 'setPtr'
	| 'handleNext'
	| 'handlePrev'
	| 'ptr'
	| 'records'
>

const FindAndReplaceResults = ({
	occurrences,
	recordTexts,
	setPtr,
	replace,
	search,
	ptr,
	records,
	handleNext,
	handlePrev,
}: FindAndReplaceResultsProps) => {
	if (!search) {
		return null
	}

	if (occurrences === 0) {
		return <p>No Result Found</p>
	}

	return (
		<section>
			<div className="border-fm-divider-tertiary flex items-center justify-between gap-2 border-b px-6 py-1">
				<Typography
					variant="caption-medium"
					as="span"
					color="tertiary"
					transform="uppercase"
				>
					{occurrences} Results
				</Typography>
				<div className="flex items-center gap-2">
					<IconButton
						label="Select Next Node"
						variant="ghost"
						size="small"
						onClick={handleNext}
						icon={<ArrowRightIcon className="size-4 rotate-90" />}
						shape="square"
						disabled={ptr === records.length - 1}
					/>
					<IconButton
						label="Select Previous Node"
						variant="ghost"
						size="small"
						onClick={handlePrev}
						icon={<ArrowRightIcon className="size-4 -rotate-90" />}
						shape="square"
						disabled={ptr < 1}
					/>
				</div>
			</div>
			<ul className="flex flex-col pt-4">
				<ForEach data={recordTexts}>
					{(data, idx) => (
						<li
							key={idx}
							className="text-fm-tertiary cursor-pointer px-6 py-2 [font-size:var(--text-fm-md)]"
							onClick={() => setPtr(idx)}
						>
							<span>{data[0]}</span>
							<del className="text-fm-secondary">{data[1]}</del>
							<If condition={!!replace}>
								<span className="text-fm-primary"> {replace}</span>
							</If>
							<span>{data[2]}</span>
						</li>
					)}
				</ForEach>
			</ul>
		</section>
	)
}

export default FindAndReplaceResults
