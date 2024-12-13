import React from 'react'
import usePlateStore, { setSidebar } from '@/store/plate-store'
import { Book } from 'lucide-react'

import { ToolbarButton } from './toolbar'

export default function TranslationToggleButton() {
	const sidebar = usePlateStore((state) => state.sidebar)
	const onTranslation = () => {
		setSidebar('translation', true)
	}
	return (
		<ToolbarButton
			variant={sidebar === 'translation' ? 'active' : 'default'}
			tooltip="Dual View"
			onClick={onTranslation}
		>
			<Book className="size-4" />
		</ToolbarButton>
	)
}
