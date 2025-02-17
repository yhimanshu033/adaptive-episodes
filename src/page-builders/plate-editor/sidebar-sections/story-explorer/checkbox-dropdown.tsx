import React from 'react'
import useAIStore from '@/store/ai-store'
import { Settings } from 'lucide-react'
import { useShallow } from 'zustand/react/shallow'

import { Button } from '@/components/ui/button'
import CheckboxComponent from '@/components/ui/checkbox-component'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function CheckboxDropdown() {
	const { store: useAIContextStore, setStoryExplorerConfigurationValue } =
		useAIStore()
	const storyExplorerConfiguration = useAIContextStore(
		useShallow((state) => state.storyExplorerConfiguration)
	)
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild className="absolute right-0 top-0 mt-0">
				<Button variant="outline" size="icon">
					<Settings />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-fit">
				<DropdownMenuLabel>Configure</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuGroup className="space-y-4 p-2">
					<CheckboxComponent
						checked={storyExplorerConfiguration.current_ep}
						onCheckedChange={(val) =>
							setStoryExplorerConfigurationValue('current_ep', !!val)
						}
						label="Aktuelle Episode"
					/>
					<CheckboxComponent
						checked={storyExplorerConfiguration.prev_eps}
						onCheckedChange={(val) =>
							setStoryExplorerConfigurationValue('prev_eps', !!val)
						}
						label="Fokus: Vorherige Episoden"
					/>
					<CheckboxComponent
						checked={storyExplorerConfiguration.next_eps}
						onCheckedChange={(val) =>
							setStoryExplorerConfigurationValue('next_eps', !!val)
						}
						label="Fokus: Kommende Episoden"
					/>
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
