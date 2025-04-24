import React, { useCallback, useMemo, useState } from 'react'
import { LSMappingGenders, LSMappingTypes } from '@/constants/ai-constants'
import { Plus, Trash2 } from 'lucide-react'

import IfElse, { Else, If } from '@/components/if-else'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import {
	isInvalidLSMapping,
	parseInputLSMapping,
	parseOutputLSMapping,
} from '@/lib/utils/helpers'

import {
	ELSMappingGender,
	ELSMappingType,
	LSMappingInput,
	LSMappingOutput,
	LSMappingOutputItem,
} from '@/types/common'

export default function LSTableEditor({
	inputData,
	onSubmit,
}: {
	inputData: LSMappingInput
	onSubmit: (data: LSMappingOutput) => void
}) {
	const [tableData, setTableData] = useState<LSMappingOutput['ls_mapping']>(
		parseInputLSMapping(inputData)
	)

	const disabled = useMemo(() => isInvalidLSMapping(tableData), [tableData])

	const handleSubmit = useCallback(() => {
		if (isInvalidLSMapping(tableData)) return
		const refinedTableData = parseOutputLSMapping(tableData)
		onSubmit({ ls_mapping: refinedTableData })
	}, [tableData, onSubmit])

	const addNewRow = () => {
		setTableData([
			...tableData,
			{
				original_name: '',
				localised_name: '',
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
					<div>original_name</div>
					<div>localised_name</div>
					<div>Type</div>
					<div>Gender</div>
					<div>Actions</div>
				</div>
				<ScrollArea className="h-96">
					{tableData.map((item, index) => (
						<div key={index} className="grid grid-cols-5 gap-4 border-t p-4">
							<Input
								value={item['original_name']}
								onChange={(e) =>
									updateField(index, 'original_name', e.target.value)
								}
								placeholder="original_name"
							/>
							<Input
								value={item['localised_name']}
								onChange={(e) =>
									updateField(index, 'localised_name', e.target.value)
								}
								placeholder="localised_name"
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
							<IfElse condition={item.type === ELSMappingType.PERSON}>
								<If>
									<Select
										defaultValue={ELSMappingGender.MALE}
										value={item.gender}
										onValueChange={(value) =>
											updateField(index, 'gender', value)
										}
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
								</If>
								<Else>
									<div />
								</Else>
							</IfElse>
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
							No data available.
						</div>
					)}
				</ScrollArea>
			</div>
			<div className="flex justify-end">
				<Button disabled={disabled} onClick={handleSubmit} className="ml-auto">
					Adapt
				</Button>
			</div>
		</div>
	)
}
