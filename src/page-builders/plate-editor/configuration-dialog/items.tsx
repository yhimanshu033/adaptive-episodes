import React from 'react'

import { Button } from '@/components/aural-ui/button'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/aural-ui/select'
import { Switch } from '@/components/aural-ui/switch'

import {
	EConfigurationContentItemDataType,
	TConfigurationContentItem,
} from '@/types/editor-types'

interface ConfigurationContentItemProps {
	item: TConfigurationContentItem
}

function ConfigurationContentItemDataHandler(
	data: TConfigurationContentItem['data']
) {
	if (data.type === EConfigurationContentItemDataType.CUSTOM) {
		return data.customHandler
	}

	if (data.type === EConfigurationContentItemDataType.BUTTON) {
		return (
			<Button variant="outline" size="sm" onClick={data.onSelect}>
				{data.buttonText || 'Trigger'}
			</Button>
		)
	}

	if (data.type === EConfigurationContentItemDataType.TOGGLE) {
		return (
			<Switch
				checked={data.selectedValue}
				onCheckedChange={data.onSelect}
				className="border-fm-divider-primary!"
				onIcon={data.onIcon}
				offIcon={data.offIcon}
			/>
		)
	}

	if (data.type === EConfigurationContentItemDataType.DROPDOWN) {
		return (
			<Select value={data.selectedValue} onValueChange={data.onSelect}>
				<SelectTrigger decoration="outline" className="w-fit">
					<SelectValue placeholder="Select a value" />
				</SelectTrigger>
				<SelectContent align="end">
					{data.dropdownItems.map((dropdownItem) => (
						<SelectItem key={dropdownItem.value} value={dropdownItem.value}>
							{dropdownItem.title || dropdownItem.value}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		)
	}

	return null
}

export function ConfigurationContentItem({
	item,
}: ConfigurationContentItemProps) {
	return (
		<div className="border-fm-divider-primary flex h-15 w-full items-center justify-between border-b border-dashed">
			<div className="flex flex-col gap-1">
				<h3 className="text-sm">{item.title}</h3>
				<div className="text-fm-secondary text-xs">{item.description}</div>
			</div>
			<ConfigurationContentItemDataHandler {...item.data} />
		</div>
	)
}
