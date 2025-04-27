'use client'

import React, { useEffect, useState } from 'react'
import { colorOptions, USER_SELECTED_COLOR } from '@/constants/global-constants'

import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

import { TColorKey } from '@/types/editor-types'

export function ColorPicker() {
	const [selectedColor, setSelectedColor] = useState<TColorKey>('Pink')

	useEffect(() => {
		const userSelectedColor = localStorage.getItem(
			USER_SELECTED_COLOR
		) as TColorKey
		if (userSelectedColor) {
			setSelectedColor(userSelectedColor)
		}
	}, [])

	const handleColorChange = (key: TColorKey) => {
		setSelectedColor(key)
		const settingsPage = document.getElementById('settings-page') as
			| HTMLDivElement
			| undefined
		if (!settingsPage) {
			return
		}
		document.documentElement.style.setProperty(
			'--primary',
			colorOptions[key].value
		)
		document.documentElement.style.setProperty(
			'--secondary',
			colorOptions[key].secondary
		)

		localStorage.setItem(USER_SELECTED_COLOR, key)
	}

	return (
		<div className="space-y-4">
			<h3 className="text-lg font-semibold">Change Primary Color</h3>
			<RadioGroup
				defaultValue={selectedColor}
				onValueChange={handleColorChange}
				className="flex flex-wrap gap-4"
			>
				{Object.keys(colorOptions).map((colorKey) => (
					<div key={colorKey} className="flex items-center space-x-2">
						<RadioGroupItem
							value={colorKey}
							id={colorKey}
							className="sr-only"
						/>
						<Label
							htmlFor={colorKey}
							className="flex cursor-pointer flex-col items-center"
						>
							<div
								className={`size-8 rounded-full border-2 ${
									selectedColor === colorKey
										? 'border-black dark:border-white'
										: 'border-transparent'
								}`}
								style={{
									backgroundColor: `hsl(${colorOptions[colorKey as TColorKey].value})`,
								}}
							/>
							<span className="mt-1 text-xs">{colorKey}</span>
						</Label>
					</div>
				))}
			</RadioGroup>
		</div>
	)
}
