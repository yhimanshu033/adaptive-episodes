import React from 'react'
import useDisableTools from '@/hooks/use-disable-tools'
import useIsGerman from '@/hooks/use-is-german'
import { Search } from 'lucide-react'

import { SidebarToggleButton } from '@/components/plate-ui/sidebar-toggle-button'

import { ESidebar } from '@/types/plate-types'

export default function ToggleFindAndReplace() {
	const isGerman = useIsGerman()
	const { isDisabled } = useDisableTools()
	if (isDisabled) {
		return
	}
	return (
		<SidebarToggleButton
			sidebar={ESidebar.FAR}
			tooltip={isGerman ? 'Find and Replace' : 'Localization'}
		>
			<Search />
		</SidebarToggleButton>
	)
}
