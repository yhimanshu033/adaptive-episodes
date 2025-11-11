import React from 'react'
import useOutlinerEnabled from '@/page-builders/plate-editor/sidebar-sections/outliner/hooks/use-outliner-enabled'
import OutlinerContent from '@/page-builders/plate-editor/sidebar-sections/outliner/outliner-content'
import OutlinerHeader from '@/page-builders/plate-editor/sidebar-sections/outliner/outliner-header'

import { cn } from '@/lib/aural-ui/utils'

export default function Outliner() {
	const enabled = useOutlinerEnabled()

	if (!enabled) {
		return null
	}

	return (
		<div className={cn('flex h-full max-h-[calc(100vh-107px)] flex-col')}>
			<OutlinerHeader />
			<OutlinerContent />
		</div>
	)
}
