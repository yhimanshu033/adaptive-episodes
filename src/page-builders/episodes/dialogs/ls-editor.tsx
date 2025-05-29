import React, { memo, useCallback, useMemo } from 'react'
import LSEditorRow from '@/page-builders/episodes/dialogs/ls-editor-row'
import { Plus } from 'lucide-react'

import { If } from '@/components/if-else'
import { Button } from '@/components/ui/button'
import ForEach from '@/components/ui/for-each'
import {
	Table,
	TableBody,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import { isInvalidLSMapping, parseOutputLSMapping } from '@/lib/utils/helpers'

import {
	ELSMappingGender,
	ELSMappingType,
	LSMappingOutput,
	LSMappingOutputItem,
} from '@/types/common'

const LSTableEditor = memo(
	({
		tableData = [],
		setTableData = () => {},
		onSubmit = () => {},
		viewOnly = false,
	}: {
		onSubmit?: (data: LSMappingOutput) => void
		setTableData?: React.Dispatch<
			React.SetStateAction<LSMappingOutput['ls_mapping']>
		>
		tableData?: LSMappingOutput['ls_mapping']
		viewOnly?: boolean
	}) => {
		const disabled = useMemo(() => isInvalidLSMapping(tableData), [tableData])

		const keys = useMemo(() => Object.keys(tableData[0] || {}), [tableData])

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
			value: string | boolean
		) => {
			setTableData((prev) => {
				const updatedData = [...prev]
				updatedData[index] = {
					...updatedData[index],
					[field]: value as string,
				}
				return updatedData
			})
		}

		return (
			<div className="space-y-4 overflow-x-auto">
				<If condition={!viewOnly}>
					<div className="flex items-center justify-between">
						<h3 className="text-lg font-medium">Table Editor</h3>
						<Button onClick={addNewRow} size="sm">
							<Plus className="mr-2 size-4" /> Add Row
						</Button>
					</div>
				</If>

				<div className="max-h-96 max-w-full overflow-auto">
					<Table>
						<TableHeader className="bg-background sticky top-0 z-10">
							<TableRow>
								<ForEach data={keys}>
									{(item, idx) => <TableHead key={idx}>{item}</TableHead>}
								</ForEach>
							</TableRow>
						</TableHeader>
						<TableBody>
							<ForEach data={tableData}>
								{(item, index) => (
									<LSEditorRow
										rows={keys}
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
								<div className="text-muted-foreground p-4 text-center">
									No data available.
								</div>
							</If>
						</TableBody>
					</Table>
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
