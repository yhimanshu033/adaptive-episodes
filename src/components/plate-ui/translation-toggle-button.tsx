import React from 'react'
import { toggleTranslation } from '@/store/plate-store'
import { Book } from 'lucide-react'

import { ToolbarButton } from './toolbar'

export default function TranslationToggleButton() {
	return (
		<ToolbarButton tooltip="Translate" onClick={toggleTranslation}>
			<Book className="size-4" />
		</ToolbarButton>
	)
}
