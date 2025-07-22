import React from 'react'
import useAIStore from '@/store/ai-store'
import { Settings } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

import { EFocusSetting } from '@/types/ai-types'

export function ExplorerSettings() {
	const { store, setFocusConfig } = useAIStore()
	const explorerFocusConfig = store((state) => state.explorerFocusConfig)

	return (
		<DropdownMenu>
			<DropdownMenuTrigger
				asChild
				className="absolute -right-1 translate-x-full"
			>
				<Button tooltip="Configurations" variant="outline" size="icon">
					<Settings />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="start" className="w-fit">
				<DropdownMenuLabel>Configure</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuGroup className="space-y-4 p-2">
					<RadioGroup
						value={explorerFocusConfig}
						onValueChange={setFocusConfig}
					>
						<div className="flex items-center space-x-2">
							<RadioGroupItem id="cms" value={EFocusSetting.CMS} />
							<Label id="cms">Use CMS episodes</Label>
						</div>
						<div className="flex items-center space-x-2">
							<RadioGroupItem
								value={EFocusSetting.BASE_SCRIPT}
								id="base_script"
							/>
							<Label id="base_script">Use base script episodes</Label>
						</div>
					</RadioGroup>
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
