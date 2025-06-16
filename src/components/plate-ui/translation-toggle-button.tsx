import React from 'react'
import useDisableTools from '@/hooks/use-disable-tools'
import ChevronDownIcon from '@/icons/chevron-down-icon'
import { LayoutColumnIcon } from '@/icons/layout-column-icon'
import usePlateStore from '@/store/plate-store'

import { ToolbarButton } from '@/components/plate-ui/toolbar'

import { ESidebar } from '@/types/plate-types'

export default function TranslationToggleButton() {
	const { store, setSidebar } = usePlateStore()
	const sidebar = store((state) => state.sidebar)
	const { isDisabled } = useDisableTools()
	const onTranslation = () => {
		setSidebar(ESidebar.DUAL_VIEW, true)
	}
	return (
		<ToolbarButton
			variant={sidebar === ESidebar.DUAL_VIEW ? 'active' : 'default'}
			tooltip="Dual View"
			disabled={isDisabled}
			onClick={onTranslation}
		>
			<LayoutColumnIcon className="size-4" />
			<ChevronDownIcon className="ml-2 size-4" />
		</ToolbarButton>
	)
}
