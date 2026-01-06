'use client'

import * as React from 'react'
import { zoomToWidth } from '@/constants/editor-constants'
import type { DropdownMenuProps } from '@radix-ui/react-dropdown-menu'

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuRadioItem,
	DropdownMenuTrigger,
} from '@/components/aural-ui/dropdown'
import useConfiguration from '@/providers/configuration-provider'

import { TZoomLevel } from '@/types/editor-types'

import { ToolbarButton, ToolbarMenuGroup } from './toolbar'

export function ZoomDropdownToolbarButton({
	buttonProps,
	...props
}: DropdownMenuProps & {
	buttonProps?: React.ComponentProps<typeof ToolbarButton>
}) {
	const [open, setOpen] = React.useState(false)
	const { configurationData, handleConfigurationDataChange } =
		useConfiguration()

	const selectedItem = React.useMemo(
		() => String(configurationData.zoomLevel ?? 100),
		[configurationData]
	)

	return (
		<DropdownMenu open={open} onOpenChange={setOpen} modal={false} {...props}>
			<DropdownMenuTrigger asChild>
				<ToolbarButton
					pressed={open}
					tooltip="Zoom Level"
					isDropdown
					{...buttonProps}
				>
					{selectedItem === 'Fit' ? selectedItem : `${selectedItem}%`}
				</ToolbarButton>
			</DropdownMenuTrigger>

			<DropdownMenuContent
				className="ignore-click-outside/toolbar min-w-50"
				align="start"
			>
				<ToolbarMenuGroup
					className="flex flex-col gap-0.5"
					value={selectedItem}
					onValueChange={(zoom) => {
						handleConfigurationDataChange({
							zoomLevel: zoom === 'Fit' ? zoom : (Number(zoom) as TZoomLevel),
						})
					}}
				>
					<DropdownMenuRadioItem
						key={'Fit'}
						className="text-fm-md min-w-[180px] py-2"
						value={'Fit'}
					>
						Fit
					</DropdownMenuRadioItem>
					{Object.keys(zoomToWidth)
						.slice(0)
						.map((zoomKey) => (
							<DropdownMenuRadioItem
								key={zoomKey}
								className="text-fm-md min-w-[180px] py-2"
								value={zoomKey}
							>
								{`${zoomKey}%`}
							</DropdownMenuRadioItem>
						))}
				</ToolbarMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
