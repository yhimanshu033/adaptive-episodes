import React from 'react'
import { sidebarToTitle } from '@/constants/ai-constants'

import { If } from '@/components/aural-ui/if-else'
import { Typography } from '@/components/aural-ui/typography'

import { ESidebar } from '@/types/plate-types'

import { IFindAndReplaceUIProps } from './far'
import FarCloseBtn from './far-close-btn'
import FarFilterDropdown from './far-filter-dropdown'

type FarHeaderProps = Pick<IFindAndReplaceUIProps, 'sheetURL' | 'isWriter'> & {
	hideCloseButton?: boolean
	value: Pick<
		IFindAndReplaceUIProps,
		'caseSensitive' | 'wholeWord' | 'toggleSearchMode'
	>
}

const FarHeader = ({
	sheetURL,
	isWriter,
	value,
	hideCloseButton,
}: FarHeaderProps) => {
	return (
		<section className="border-fm-divider-tertiary bg-fm-surface-primary sticky top-0 left-0 z-20 flex min-h-15.5 items-center justify-between gap-4 border-y py-3 pr-4 pl-7">
			<Typography variant="body-small" as="h4">
				{sidebarToTitle[ESidebar.FAR]}
			</Typography>
			<div className="flex items-center gap-2">
				<FarFilterDropdown
					sheetURL={sheetURL}
					isWriter={isWriter}
					value={value}
				/>
				<If condition={!hideCloseButton}>
					<FarCloseBtn />
				</If>
			</div>
		</section>
	)
}

export default FarHeader
