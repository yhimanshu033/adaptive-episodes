import React from 'react'
import RunNWMButton from '@/page-builders/plate-editor/buttons/run-nwm'
import SyncMetaData from '@/page-builders/plate-editor/buttons/sync-metadata'
import useAIStore from '@/store/ai-store'
import { useShallow } from 'zustand/react/shallow'

import { Checkbox } from '@/components/aural-ui/checkbox'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from '@/components/aural-ui/dropdown'
import { If } from '@/components/aural-ui/if-else'
import Label from '@/components/aural-ui/label'
import { List, ListItem, ListSeparator } from '@/components/aural-ui/list'

export function CheckboxDropdown({ children }: { children: React.ReactNode }) {
	const { store: useAIContextStore, setStoryExplorerConfigurationValue } =
		useAIStore()
	const storyExplorerConfiguration = useAIContextStore(
		useShallow((state) => state.storyExplorerConfiguration)
	)
	const handleConfigChange = React.useCallback(
		(key: keyof typeof storyExplorerConfiguration, value: boolean) => {
			setStoryExplorerConfigurationValue(key, value)
		},
		[setStoryExplorerConfigurationValue]
	)

	const checkboxItems = React.useMemo(
		() => [
			{
				key: 'current_ep' as const,
				label: 'Current Episode',
				checked: storyExplorerConfiguration.current_ep,
			},
			{
				key: 'prev_eps' as const,
				label: 'Previous Episodes',
				checked: storyExplorerConfiguration.prev_eps,
			},
			{
				key: 'next_eps' as const,
				label: 'Upcoming Episodes',
				checked: storyExplorerConfiguration.next_eps,
			},
		],
		[storyExplorerConfiguration]
	)

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
			<DropdownMenuContent align="start" className="w-fit">
				<SyncMetaData />
				<div className="h-1" />
				<RunNWMButton />
				<List size="sm" className="bg-fm-surface-frosted/20 pt-2">
					{checkboxItems.map(({ key, label, checked }, index) => (
						<React.Fragment key={`ai-checkbox-item-${index}`}>
							<ListItem
								className="flex items-center gap-2 py-1 hover:bg-inherit"
								key={key}
							>
								<Checkbox
									id={key}
									checked={checked}
									onCheckedChange={(val) => handleConfigChange(key, !!val)}
								/>
								<Label htmlFor={key}>{label}</Label>
							</ListItem>
							<If condition={index !== checkboxItems.length - 1}>
								<ListSeparator />
							</If>
						</React.Fragment>
					))}
				</List>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
