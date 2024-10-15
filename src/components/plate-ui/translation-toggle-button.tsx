import React, { useCallback } from 'react'
import usePlateStore, {
	setSidebar,
	toggleTranslation,
} from '@/store/plate-store'
import { Book } from 'lucide-react'

import { ToolbarButton } from './toolbar'

export default function TranslationToggleButton() {
	const translation = usePlateStore((state) => state.isTranslationOpen)
	const sidebar = usePlateStore((state) => state.sidebar)
	const onTranslation = useCallback(() => {
		setSidebar(null)
		if (!translation || (translation && !sidebar)) toggleTranslation()
	}, [sidebar, translation])
	return (
		<ToolbarButton
			variant={translation && !sidebar ? 'active' : 'default'}
			tooltip="Dual View"
			onClick={onTranslation}
		>
			<Book className="size-4" />
		</ToolbarButton>
	)
}
