import React from 'react'
import useDisableTools from '@/hooks/use-disable-tools'
import usePlateStore from '@/store/plate-store'
import { Diff } from 'lucide-react'
import { useShallow } from 'zustand/react/shallow'

import { ToolbarButton } from '@/components/plate-ui/toolbar'

import { ESidebar } from '@/types/plate-types'

export default function LocalChangesDiffButton() {
	const { store, setSidebar } = usePlateStore()
	const sidebar = store((state) => state.sidebar)
	const localDiffValue = store(useShallow((state) => state.localDiffValue))
	const { isDisabled } = useDisableTools()

	const onDiffClick = () => {
		setSidebar(ESidebar.LOCAL_DIFF, true)
	}

	if (!localDiffValue) {
		return null
	}

	return (
		<ToolbarButton
			variant={sidebar === ESidebar.LOCAL_DIFF ? 'active' : 'default'}
			tooltip="Local Changes Diff"
			disabled={isDisabled}
			onClick={onDiffClick}
		>
			<Diff className="size-4" />
		</ToolbarButton>
	)
}
