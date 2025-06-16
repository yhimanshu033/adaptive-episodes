import React from 'react'
import { sidebarButtons, sidebarToTitle } from '@/constants/ai-constants'
import { CrossIcon } from '@/icons/cross-icon'
import usePlateStore from '@/store/plate-store'
import { useShallow } from 'zustand/react/shallow'

import { IconButton } from '@/components/aural-ui/icon-button'
import { Else, If, IfElse } from '@/components/aural-ui/if-else'
import { Tabs, TabsList, TabsTrigger } from '@/components/aural-ui/tabs'
import ForEach from '@/components/ui/for-each'

import { ESidebar } from '@/types/plate-types'

export default function SidebarTopBar() {
	const { store: plateStore, setSidebar } = usePlateStore()
	const sidebar = plateStore(useShallow((state) => state.sidebar))

	if (!sidebar) {
		return null
	}

	return (
		<div className="bg-fm-surface-primary border-fm-divider-tertiary sticky top-0 z-20 h-14 border">
			<IfElse condition={sidebarButtons.includes(sidebar)}>
				<If>
					<Tabs defaultValue={ESidebar.CHATBOT}>
						<TabsList className="justify-between">
							<ForEach data={sidebarButtons}>
								{(sidebarItem, idx) => (
									<TabsTrigger
										key={idx}
										onClick={() => setSidebar(sidebarItem)}
										className="text-fm-md"
										value={sidebarItem}
									>
										{sidebarToTitle[sidebarItem]}
									</TabsTrigger>
								)}
							</ForEach>
						</TabsList>
					</Tabs>
				</If>
				<Else>
					<div className="flex h-14 items-center justify-between gap-4 pr-4 pl-7">
						<h4>{sidebarToTitle[sidebar]}</h4>
						<IconButton
							label="Close Sidebar"
							variant="ghost"
							className="hover:bg-transparent"
							onClick={() => setSidebar(null)}
							icon={<CrossIcon className="size-4" />}
						/>
					</div>
				</Else>
			</IfElse>
		</div>
	)
}
