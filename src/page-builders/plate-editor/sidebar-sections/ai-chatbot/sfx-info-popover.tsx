import React from 'react'
import { SFX_INFO } from '@/constants/ai-constants'
import { Check, CheckCheck, Info, X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover'

export function SfxInfoComponent() {
	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button tooltip="Information" size="sm" variant="ghost">
					<Info />
				</Button>
			</PopoverTrigger>
			<PopoverContent side="left" align="start" className="w-[50vw]">
				<div className="grid grid-cols-[1fr_12fr] items-center gap-4">
					<Button>
						<Check />
					</Button>
					<p>{SFX_INFO.SINGLE_TICK}</p>
					<Button variant="outline">
						<CheckCheck />
					</Button>
					<p>{SFX_INFO.DOUBLE_TICK}</p>
					<Button variant="outline">
						<X />
					</Button>
					<p>{SFX_INFO.CROSS}</p>
				</div>
			</PopoverContent>
		</Popover>
	)
}
