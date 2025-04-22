'use client'

import React, { useState } from 'react'
import { LSMappingGenders, LSMappingTypes } from '@/constants/ai-constants'
import { Plus, Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { parseInputLSMapping } from '@/lib/utils/helpers'

import {
	ELSMappingGender,
	ELSMappingType,
	LSMappingInput,
	LSMappingOutput,
	LSMappingOutputItem,
} from '@/types/common'

const sampleData: LSMappingInput = {
	ls_mapping: {
		andre: {
			'localised name': 'john',
			type: ELSMappingType.PERSON,
			gender: ELSMappingGender.MALE,
		},
		maria: {
			'localised name': 'mary',
			type: ELSMappingType.PERSON,
			gender: ELSMappingGender.FEMALE,
		},
	},
}
export default function LSTableEditor() {
	const [tableData, setTableData] = useState<LSMappingOutput['ls_mapping']>(
		parseInputLSMapping(sampleData)
	)

	const handleSubmit = () => {
		console.log(tableData)
	}

	const addNewRow = () => {
		setTableData([
			...tableData,
			{
				'original name': '',
				'localised name': '',
				type: ELSMappingType.PERSON,
				gender: ELSMappingGender.MALE,
			},
		])
	}

	const removeRow = (index: number) => {
		setTableData(tableData.filter((_, i) => i !== index))
	}

	const updateField = (
		index: number,
		field: keyof LSMappingOutputItem,
		value: string
	) => {
		setTableData((prev) => {
			const updatedData = [...prev]
			updatedData[index] = {
				...updatedData[index],
				[field]: value,
			}
			return updatedData
		})
	}

	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				<h3 className="text-lg font-medium">Table Editor</h3>
				<Button onClick={addNewRow} size="sm">
					<Plus className="mr-2 size-4" /> Add Row
				</Button>
			</div>

			<div className="rounded-md border">
				<div className="grid grid-cols-5 gap-4 bg-muted p-4 font-medium">
					<div>Original Name</div>
					<div>Localised Name</div>
					<div>Type</div>
					<div>Gender</div>
					<div>Actions</div>
				</div>

				{tableData.map((item, index) => (
					<div key={index} className="grid grid-cols-5 gap-4 border-t p-4">
						<Input
							value={item['original name']}
							onChange={(e) =>
								updateField(index, 'original name', e.target.value)
							}
							placeholder="Original name"
						/>
						<Input
							value={item['localised name']}
							onChange={(e) =>
								updateField(index, 'localised name', e.target.value)
							}
							placeholder="Localised name"
						/>
						<Select
							value={item.type}
							onValueChange={(value) => updateField(index, 'type', value)}
						>
							<SelectTrigger>
								<SelectValue placeholder="Type" />
							</SelectTrigger>
							<SelectContent>
								{LSMappingTypes.map((type) => (
									<SelectItem key={type} value={type}>
										{type.toUpperCase()}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						<Select
							value={item.gender}
							onValueChange={(value) => updateField(index, 'gender', value)}
						>
							<SelectTrigger>
								<SelectValue placeholder="Gender" />
							</SelectTrigger>
							<SelectContent>
								{LSMappingGenders.map((gender) => (
									<SelectItem key={gender} value={gender}>
										{gender}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						<Button
							variant="destructive"
							size="icon"
							onClick={() => removeRow(index)}
						>
							<Trash2 className="size-4" />
						</Button>
					</div>
				))}

				{tableData.length === 0 && (
					<div className="p-4 text-center text-muted-foreground">
						No data available. Parse JSON input or add rows manually.
					</div>
				)}
			</div>
			<Button onClick={handleSubmit} className="ml-auto">
				Convert and Log Output
			</Button>
		</div>
	)
}
