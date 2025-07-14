import React, { useEffect, useMemo } from 'react'
import useEpisodeContent from '@/hooks/query/use-episode-content'
import useAccessChecks from '@/hooks/use-access-checks'
import useDisableTools from '@/hooks/use-disable-tools'
import { LayoutColumnIcon } from '@/icons/layout-column-icon'
import useEpisodeIdStore from '@/store/episode-id-store'
import usePlateStore from '@/store/plate-store'
import type { DropdownMenuProps } from '@radix-ui/react-dropdown-menu'
import { useShallow } from 'zustand/react/shallow'

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuTrigger,
	useOpenState,
} from '@/components/plate-ui/dropdown-menu'
import { ToolbarButton } from '@/components/plate-ui/toolbar'

import {
	DUAL_VIEW_MODES,
	EDualVIewMode,
	MODE_TO_TITLE,
} from '@/types/episode-type'
import { ESidebar } from '@/types/plate-types'

export default function TranslationToggleButton({
	buttonProps,
	...props
}: DropdownMenuProps & {
	buttonProps?: React.ComponentProps<typeof ToolbarButton>
}) {
	const { store: useEpisodeIdStoreContext, setDualViewMode } =
		useEpisodeIdStore()
	const { store, setSidebar } = usePlateStore()
	const sidebar = store((state) => state.sidebar)
	const { isDisabled } = useDisableTools()
	const { store: useEpisodePlateStore } = usePlateStore()
	const openState = useOpenState()
	const { data } = useEpisodeContent()
	const dualViewMode = useEpisodeIdStoreContext(
		useShallow((state) => state.dualViewMode)
	)

	const { isGerman } = useAccessChecks()

	const localDiffValue = useEpisodePlateStore(
		useShallow((state) => state.localDiffValue)
	)

	const modes = useMemo(() => {
		const excludedModes: EDualVIewMode[] = []
		if (!data?.previous_parent_id) {
			excludedModes.push(EDualVIewMode.PREV_EP)
		}
		if (!data?.next_parent_id) {
			excludedModes.push(EDualVIewMode.NEXT_EP)
		}
		if (!localDiffValue) {
			excludedModes.push(EDualVIewMode.LOCAL_DIFF)
		}
		return DUAL_VIEW_MODES.filter((item) => !excludedModes.includes(item))
	}, [data?.previous_parent_id, data?.next_parent_id, localDiffValue])

	const modeToTitle = useMemo(() => {
		if (!isGerman) {
			MODE_TO_TITLE[EDualVIewMode.US_TRANSLATION] = 'Source Script'
		}
		return MODE_TO_TITLE
	}, [isGerman])

	useEffect(() => {
		setDualViewMode(null)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	const onTranslation = (value: string) => {
		setSidebar(ESidebar.DUAL_VIEW, false)
		setDualViewMode(value as EDualVIewMode)
	}

	return (
		<DropdownMenu modal={false} {...openState} {...props}>
			<DropdownMenuTrigger asChild>
				<ToolbarButton
					tooltip="Dual View"
					disabled={isDisabled}
					pressed={openState.open}
					variant={sidebar === ESidebar.DUAL_VIEW ? 'active' : 'default'}
					isDropdown
					className="focus-visible:ring-0 focus-visible:ring-offset-0"
					{...buttonProps}
				>
					<LayoutColumnIcon className="size-4" />
				</ToolbarButton>
			</DropdownMenuTrigger>

			<DropdownMenuContent className="min-w-50" align="end">
				<DropdownMenuRadioGroup
					value={dualViewMode ? dualViewMode : undefined}
					onValueChange={onTranslation}
				>
					{modes.map((mode) => (
						<DropdownMenuRadioItem
							key={mode}
							value={mode}
							className="[font-size:var(--text-fm-md)]"
						>
							{modeToTitle[mode]}
						</DropdownMenuRadioItem>
					))}
				</DropdownMenuRadioGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
