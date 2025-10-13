import React from 'react'
import { CrossIcon } from '@/icons/cross-icon'
import usePlateStore from '@/store/plate-store'

import { IconButton } from '@/components/aural-ui/icon-button'

export default function FarCloseBtn() {
	const { setSidebar } = usePlateStore()

	return (
		<IconButton
			label="Close Sidebar"
			variant="ghost"
			size="small"
			onClick={() => setSidebar(null)}
			icon={<CrossIcon className="size-4" />}
			shape="square"
		/>
	)
}
