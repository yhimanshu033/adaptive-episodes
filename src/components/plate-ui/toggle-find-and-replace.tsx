import React from 'react'
import useDisableTools from '@/hooks/use-disable-tools'
import useIsGerman from '@/hooks/use-is-german'
import usePlateStore from '@/store/plate-store'
import { Search } from 'lucide-react'

import { ESidebar } from '@/types/plate-types'

import { ToolbarButton } from './toolbar'

export default function ToggleFindAndReplace() {
	const { store, setSidebar } = usePlateStore()
	const currentSidebar = store((state) => state.sidebar)
	const isActive = currentSidebar === ESidebar.FAR

	const isGerman = useIsGerman()
	const { isDisabled } = useDisableTools()

	if (isDisabled) {
		return
	}

	return (
		<ToolbarButton
			variant={isActive ? 'active' : 'default'}
			tooltip={isGerman ? 'Find and Replace' : 'Localization'}
			onClick={() => setSidebar(ESidebar.FAR, true)}
		>
			<Search className="size-4" />
		</ToolbarButton>
	)
}
