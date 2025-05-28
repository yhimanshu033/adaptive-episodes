import React from 'react'
import { useSearchParams } from 'next/navigation'
import { SIMPLIFIED_VIEWABLE_EDITOR } from '@/constants/global-constants'
import usePlateStore from '@/store/plate-store'

import { FixedToolbar } from '@/components/plate-ui/fixed-toolbar'
import { FixedToolbarButtons } from '@/components/plate-ui/fixed-toolbar-buttons'
import { cn } from '@/lib/utils/helpers'

export default function FixedToolbarComponent({
	className,
	simplified,
}: {
	className?: string
	simplified?: boolean
}) {
	const { store } = usePlateStore()
	const plateFocusMode = store((state) => state.focusMode)
	const searchParams = useSearchParams()
	const simplifiedEditor = searchParams.get(SIMPLIFIED_VIEWABLE_EDITOR)

	if (simplifiedEditor) {
		return <hr />
	}
	return (
		<div
			className={cn(
				'bg-background sticky top-0 z-40',
				{
					'-mt-4 pt-4 pb-4': plateFocusMode,
				},
				className
			)}
		>
			<FixedToolbar
				className={cn(plateFocusMode ? 'rounded-2xl' : 'rounded-none py-2')}
			>
				<FixedToolbarButtons {...{ simplified }} />
			</FixedToolbar>
		</div>
	)
}
