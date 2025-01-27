import React from 'react'
import useDisableTools from '@/hooks/use-disable-tools'
import usePlateStore from '@/store/plate-store'
import { Book } from 'lucide-react'

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
			<Book className="size-4" />
		</ToolbarButton>
	)
}
