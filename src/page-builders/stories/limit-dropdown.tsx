import React from 'react'
import { EPISODE_LIMITS } from '@/constants/episodes-constants'
import { SelectProps } from '@radix-ui/react-select'

import Label from '@/components/aural-ui/label'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/aural-ui/select'

export default function LimitDropdown(props: SelectProps) {
	return (
		<div className="flex h-10 items-center justify-between gap-2 text-xs">
			<Label className="text-fm-tertiary"> Page Size</Label>
			<Select {...props}>
				<SelectTrigger className="h-10 w-auto border-1" decoration="outline">
					<SelectValue>{props.value}</SelectValue>
				</SelectTrigger>
				<SelectContent>
					{EPISODE_LIMITS.map((ele) => (
						<SelectItem key={ele} value={String(ele)}>
							{ele}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	)
}
