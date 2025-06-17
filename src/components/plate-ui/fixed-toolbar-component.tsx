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
		<FixedToolbar
			className={cn(
				{
					'-mt-4 rounded-2xl pt-4 pb-4': plateFocusMode,
					'rounded-none px-6 py-3': !plateFocusMode,
				},
				className
			)}
		>
			<FixedToolbarButtons {...{ simplified }} />
		</FixedToolbar>
	)
}
