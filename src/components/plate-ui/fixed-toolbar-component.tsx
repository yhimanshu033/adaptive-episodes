import React from 'react'
import usePlateStore from '@/store/plate-store'

import { FixedToolbar } from '@/components/plate-ui/fixed-toolbar'
import { FixedToolbarButtons } from '@/components/plate-ui/fixed-toolbar-buttons'
import { cn } from '@/lib/utils/helpers'

export default function FixedToolbarComponent() {
	const { store } = usePlateStore()
	const plateFocusMode = store((state) => state.focusMode)
	return (
		<div
			className={cn('sticky top-0 z-40 bg-background', {
				'-mt-4 pb-4 pt-4': plateFocusMode,
			})}
		>
			<FixedToolbar className={cn({ 'rounded-2xl': plateFocusMode })}>
				<FixedToolbarButtons />
			</FixedToolbar>
		</div>
	)
}
