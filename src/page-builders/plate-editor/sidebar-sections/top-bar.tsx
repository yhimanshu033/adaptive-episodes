import React from 'react'
import { sidebarButtons, sidebarToTitle } from '@/constants/ai-constants'
import usePlateStore from '@/store/plate-store'
import { X } from 'lucide-react'
import { useShallow } from 'zustand/react/shallow'

import IfElse, { Else, If } from '@/components/if-else'
import { Button } from '@/components/ui/button'
import ForEach from '@/components/ui/for-each'

export default function SidebarTopBar() {
	const { store: plateStore, setSidebar } = usePlateStore()
	const sidebar = plateStore(useShallow((state) => state.sidebar))

	if (!sidebar) {
		return null
	}
	return (
		<div className="bg-background sticky top-0 z-20 flex h-[62px] min-h-[62px] items-center justify-between border-y px-2 py-1.5">
			<IfElse condition={sidebarButtons.includes(sidebar)}>
				<If>
					<ForEach data={sidebarButtons}>
						{(sidebarItem, idx) => (
							<Button
								key={idx}
								onClick={() => setSidebar(sidebarItem)}
								variant="ghost"
							>
								{sidebarToTitle[sidebarItem]}
							</Button>
						)}
					</ForEach>
				</If>
				<Else>
					<h4>{sidebarToTitle[sidebar]}</h4>
				</Else>
			</IfElse>
			<div>
				<Button variant="ghost" size="icon" onClick={() => setSidebar(null)}>
					<X />
				</Button>
			</div>
		</div>
	)
}
