import React from 'react'
import useDisableTools from '@/hooks/use-disable-tools'
import usePlateStore from '@/store/plate-store'
import { Book } from 'lucide-react'

import { ESidebar } from '@/types/plate-types'

import { ToolbarButton } from './toolbar'

export default function TranslationToggleButton() {
	const { store, setSidebar } = usePlateStore()
	const sidebar = store((state) => state.sidebar)
	const { isDisabled } = useDisableTools()
	const onTranslation = () => {
		setSidebar(ESidebar.TRANSLATION, true)
	}
	return (
		<ToolbarButton
			variant={sidebar === ESidebar.TRANSLATION ? 'active' : 'default'}
			tooltip="Dual View"
			disabled={isDisabled}
			onClick={onTranslation}
		>
			<Book className="size-4" />
		</ToolbarButton>
	)
}
