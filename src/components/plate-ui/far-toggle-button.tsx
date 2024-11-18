import React from 'react'
import usePlateStore, { setSidebar } from '@/store/plate-store'
import { Globe } from 'lucide-react'

import { ToolbarButton } from './toolbar'

export default function FaRToggleButton() {
	const sidebar = usePlateStore((state) => state.sidebar)
	const onToggle = () => {
		setSidebar('far', true)
	}
	return (
		<ToolbarButton
			variant={sidebar === 'far' ? 'active' : 'default'}
			tooltip="Find and Replace"
			onClick={onToggle}
		>
			<Globe className="size-4" />
		</ToolbarButton>
	)
}
