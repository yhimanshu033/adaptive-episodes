import React from 'react'
import { sidebarToTitle } from '@/constants/ai-constants'
import { CrossIcon } from '@/icons/cross-icon'
import usePlateStore from '@/store/plate-store'
import { useShallow } from 'zustand/react/shallow'

import { IconButton } from '@/components/aural-ui/icon-button'
import { If } from '@/components/aural-ui/if-else'
import { Typography } from '@/components/aural-ui/typography'

import { IFindAndReplaceUIProps } from './far'
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
	const { store: plateStore, setSidebar } = usePlateStore()
	const sidebar = plateStore(useShallow((state) => state.sidebar))

	if (!sidebar) {
		return null
	}

	return (
		<section className="border-fm-divider-tertiary bg-fm-surface-primary sticky top-0 left-0 z-20 flex min-h-15.5 items-center justify-between gap-4 border-y py-3 pr-4 pl-7">
			<Typography variant="body-small" as="h4">
				{sidebarToTitle[sidebar]}
			</Typography>
			<div className="flex items-center gap-2">
				<FarFilterDropdown
					sheetURL={sheetURL}
					isWriter={isWriter}
					value={value}
				/>
				<If condition={!hideCloseButton}>
					<IconButton
						label="Close Sidebar"
						variant="ghost"
						size="small"
						onClick={() => setSidebar(null)}
						icon={<CrossIcon className="size-4" />}
						shape="square"
					/>
				</If>
			</div>
		</section>
	)
}

export default FarHeader
