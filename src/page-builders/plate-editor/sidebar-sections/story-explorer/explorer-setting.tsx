import React from 'react'
import { FilterBarRowIcon } from '@/icons/filter-bar-row-icon'
import useAIStore from '@/store/ai-store'

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/aural-ui/dropdown'
import { IconButton } from '@/components/aural-ui/icon-button'
import { RadioGroup, RadioGroupItem } from '@/components/aural-ui/radio'
import { Label } from '@/components/ui/label'

import { EFocusSetting } from '@/types/ai-types'

export function ExplorerSettings() {
	const { store, setFocusConfig } = useAIStore()
	const explorerFocusConfig = store((state) => state.explorerFocusConfig)

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<IconButton
					label="Trigger filter dropdown"
					variant="outlined"
					className="bg-fm-hotpink-50 border-fm-hotpink-200 hover:border-fm-hotpink-300 shrink-0"
					icon={<FilterBarRowIcon className="text-fm-hotpink-400 size-4.5" />}
				/>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-fit">
				<DropdownMenuLabel className="sr-only">Configure</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuGroup className="space-y-4 p-2">
					<RadioGroup
						value={explorerFocusConfig}
						onValueChange={setFocusConfig}
					>
						<div className="flex items-center space-x-2">
							<RadioGroupItem
								id="cms"
								value={EFocusSetting.CMS}
								className="size-6"
							/>
							<Label id="cms">CMS episodes</Label>
						</div>
						<div className="flex items-center space-x-2">
							<RadioGroupItem
								value={EFocusSetting.BASE_SCRIPT}
								id="base_script"
								className="size-6"
							/>
							<Label id="base_script">Base script episodes</Label>
						</div>
					</RadioGroup>
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
