import React, { HTMLAttributes } from 'react'
import { CheckboxProps } from '@radix-ui/react-checkbox'

import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils/helpers'

export default function CheckboxComponent({
	id,
	label,
	containerProps,
	labelProps,
	...checkboxProps
}: {
	containerProps?: HTMLAttributes<HTMLDivElement>
	id?: string
	label: string
	labelProps?: HTMLAttributes<HTMLLabelElement>
} & CheckboxProps) {
	const assignedId = id || label.split(' ').join('-').toLowerCase()
	return (
		<div
			{...containerProps}
			className={cn('flex items-center space-x-2', containerProps?.className)}
		>
			<Checkbox id={assignedId} {...checkboxProps} />
			<Label
				htmlFor={assignedId}
				{...labelProps}
				className={cn(
					'text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
					labelProps?.className
				)}
			>
				{label}
			</Label>
		</div>
	)
}
