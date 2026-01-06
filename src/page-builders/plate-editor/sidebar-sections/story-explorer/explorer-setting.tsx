import React from 'react'
import { FilterBarRowIcon } from '@/icons/filter-bar-row-icon'
import useAIStore from '@/store/ai-store'

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuTrigger,
} from '@/components/aural-ui/dropdown'
import { IconButton } from '@/components/aural-ui/icon-button'
import { RadioGroup, RadioGroupItem } from '@/components/aural-ui/radio'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/aural-ui/utils'

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
					className={cn(
						'data-[state=open]:bg-fm-hotpink-50 data-[state=open]:border-fm-hotpink-300 shrink-0',
						{
							'bg-fm-hotpink-50 border-fm-hotpink-200 hover:border-fm-hotpink-300':
								explorerFocusConfig === EFocusSetting.BASE_SCRIPT,
						}
					)}
					icon={<FilterBarRowIcon className="currentColor size-4.5" />}
				/>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-fit">
				<DropdownMenuGroup>
					<RadioGroup
						value={explorerFocusConfig}
						onValueChange={setFocusConfig}
						className="gap-0 py-1"
					>
						<Label htmlFor="cms" className="flex items-center gap-2 px-4 py-2">
							<RadioGroupItem
								id="cms"
								value={EFocusSetting.CMS}
								className="size-6"
							/>{' '}
							CMS episodes
						</Label>
						<Label
							htmlFor="base_script"
							className="flex items-center gap-2 px-4 py-2"
						>
							<RadioGroupItem
								value={EFocusSetting.BASE_SCRIPT}
								id="base_script"
								className="size-6"
							/>{' '}
							Base script episodes
						</Label>
					</RadioGroup>
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
