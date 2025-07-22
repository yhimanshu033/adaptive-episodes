import React from 'react'
import { EPISODE_LIMITS } from '@/constants/episodes-constants'
import { SelectProps } from '@radix-ui/react-select'

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'

export default function LimitDropdown(props: SelectProps) {
	return (
		<div className="flex items-center justify-between gap-2 text-xs">
			<p>Episodes per page</p>
			<Select {...props}>
				<SelectTrigger className="w-16">
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
