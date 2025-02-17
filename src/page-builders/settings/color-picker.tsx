'use client'

import React, { useState } from 'react'

import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

const colorOptions = [
	{ name: 'Red', value: '0 84% 60%' },
	{ name: 'Blue', value: '217 91% 60%' },
	{ name: 'Pink', value: '330 84% 58%' },
	{ name: 'Dark Yellow', value: '49 91% 50%' },
	{ name: 'Green', value: '144 74% 45%' },
	{ name: 'Purple', value: '267 89% 64%' },
]

export function ColorPicker() {
	const [selectedColor, setSelectedColor] = useState(colorOptions[0].value)

	const handleColorChange = (value: string) => {
		const settingsPage = document.getElementById('settings-page') as
			| HTMLDivElement
			| undefined
		if (!settingsPage) return
		settingsPage.style.setProperty('--primary', value)
		setSelectedColor(value)
	}

	return (
		<div className="space-y-4">
			<h3 className="text-lg font-semibold">Change Primary Color</h3>
			<RadioGroup
				defaultValue={selectedColor}
				onValueChange={handleColorChange}
				className="flex flex-wrap gap-4"
			>
				{colorOptions.map((color) => (
					<div key={color.value} className="flex items-center space-x-2">
						<RadioGroupItem
							value={color.value}
							id={color.value}
							className="sr-only"
						/>
						<Label
							htmlFor={color.value}
							className="flex cursor-pointer flex-col items-center"
						>
							<div
								className={`size-8 rounded-full border-2 ${
									selectedColor === color.value
										? 'border-black dark:border-white'
										: 'border-transparent'
								}`}
								style={{ backgroundColor: `hsl(${color.value})` }}
							/>
							<span className="mt-1 text-xs">{color.name}</span>
						</Label>
					</div>
				))}
			</RadioGroup>
		</div>
	)
}
