import React, { memo, useCallback, useMemo, useState } from 'react'
import LSEditorRow from '@/page-builders/episodes/ls-editor-row'
import { Plus } from 'lucide-react'

import { If } from '@/components/if-else'
import { Button } from '@/components/ui/button'
import ForEach from '@/components/ui/for-each'
import { ScrollArea } from '@/components/ui/scroll-area'
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

const LSTableEditor = memo(
	({
		inputData = { ls_mapping: {} },
		onSubmit = () => {},
		viewOnly = false,
	}: {
		inputData?: LSMappingInput
		onSubmit?: (data: LSMappingOutput) => void
		viewOnly?: boolean
	}) => {
		const [tableData, setTableData] = useState<LSMappingOutput['ls_mapping']>(
			parseInputLSMapping(inputData)
		)

		const disabled = useMemo(() => isInvalidLSMapping(tableData), [tableData])

		const handleSubmit = useCallback(() => {
			if (isInvalidLSMapping(tableData)) {
				return
			}
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
						<ForEach data={tableData}>
							{(item, index) => (
								<LSEditorRow
									disabled={viewOnly}
									key={`table-row-${index}`}
									index={index}
									item={item}
									removeRow={removeRow}
									updateField={updateField}
								/>
							)}
						</ForEach>

						<If condition={tableData.length === 0}>
							<div className="p-4 text-center text-muted-foreground">
								No data available.
							</div>
						</If>
					</ScrollArea>
				</div>
				<If condition={!viewOnly}>
					<div className="flex justify-end">
						<Button
							disabled={disabled}
							onClick={handleSubmit}
							className="ml-auto"
						>
							Adapt
						</Button>
					</div>
				</If>
			</div>
		)
	}
)

LSTableEditor.displayName = 'LSTableEditor'
export default LSTableEditor
