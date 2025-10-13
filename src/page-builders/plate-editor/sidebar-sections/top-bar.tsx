import React from 'react'
import {
	HIDE_SIDEBAR_HEADER,
	sidebarButtons,
	sidebarToTitle,
} from '@/constants/ai-constants'
import { CrossIcon } from '@/icons/cross-icon'
import usePlateStore from '@/store/plate-store'
import { useEditorPlugin } from 'platejs/react'
import { useShallow } from 'zustand/react/shallow'

import { IconButton } from '@/components/aural-ui/icon-button'
import { Else, If, IfElse } from '@/components/aural-ui/if-else'
import { Tabs, TabsList, TabsTrigger } from '@/components/aural-ui/tabs'
import { commentPlugin } from '@/components/editor/plugins/comment-kit'
import ForEach from '@/components/ui/for-each'

import { ESidebar } from '@/types/plate-types'

export default function SidebarTopBar() {
	const { store: plateStore, setSidebar } = usePlateStore()
	const sidebar = plateStore(useShallow((state) => state.sidebar))
	const { setOption } = useEditorPlugin(commentPlugin)

	if (!sidebar || HIDE_SIDEBAR_HEADER.includes(sidebar)) {
		return null
	}

	return (
		<div className="bg-fm-surface-primary border-fm-divider-tertiary sticky top-0 z-20 h-15.5 border-y">
			<IfElse condition={sidebarButtons.includes(sidebar)}>
				<If>
					<Tabs defaultValue={sidebar} className="h-full">
						<TabsList className="h-full justify-between border-b-0">
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
							onClick={() => {
								setSidebar(ESidebar.CHATBOT)
								setOption('activeId', null)
							}}
							shape="square"
							size="small"
							icon={<CrossIcon className="size-4" />}
						/>
					</div>
				</Else>
			</IfElse>
		</div>
	)
}
