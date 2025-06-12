import React, { memo, useCallback, useMemo } from 'react'
import { EXCLUDED_HEADERS_LS_SHEET } from '@/constants/episodes-constants'
import LSEditorRow from '@/page-builders/episodes/dialogs/ls-editor-row'
import { Download, Plus, Upload } from 'lucide-react'
import { toast } from 'sonner'

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
import { TooltipComponent } from '@/components/ui/tooltip-component'
import { downloadBlobUrl } from '@/lib/utils/client-helpers'
import {
	buttonVariants,
	isInvalidLSMapping,
	parseOutputLSMapping,
	toSnakeCase,
} from '@/lib/utils/helpers'

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

		function handleCSV(files: FileList | null) {
			const file = files?.[0]
			if (!file) {
				return
			}
			const reader = new FileReader()
			reader.onload = (event) => {
				const text = event.target?.result as string

				const rows = text
					.trim()
					.split('\n')
					.map((row) => row.split(',').map((cell) => cell.trim()))

				const headers = rows[0].map((item) => toSnakeCase(item))
				const data = rows
					.slice(1)
					.map((row) =>
						Object.fromEntries(row.map((val, i) => [headers[i], val]))
					) as LSMappingOutputItem[]

				setTableData(data)
			}
			reader.onerror = () => {
				toast.error('Some error occurred while reading CSV')
			}
			reader.readAsText(file)
			toast.success('CSV import completed!')
		}

		function handleDownloadCSV() {
			const headers = Object.keys(tableData[0])
			const csvRows = [
				headers.join(','), // header row
				...tableData.map((row) =>
					headers
						.map(
							(header) =>
								`"${(row[header] ?? '').toString().replace(/"/g, '""')}"`
						)
						.join(',')
				),
			]

			const blob = new Blob([csvRows.join('\n')], {
				type: 'text/csv;charset=utf-8;',
			})
			const url = URL.createObjectURL(blob)
			downloadBlobUrl(url, `${new Date().toUTCString()}.csv`)
		}

		return (
			<div className="space-y-4 overflow-x-auto">
				<If condition={!viewOnly}>
					<h3 className="text-lg font-medium">Table Editor</h3>
					<div className="flex items-center justify-between">
						<div className="flex gap-2">
							<Button
								variant="outline"
								size="icon"
								tooltip="Download CSV"
								onClick={handleDownloadCSV}
							>
								<Download />
							</Button>
							<TooltipComponent tooltip="Upload CSV">
								<label
									htmlFor="csv-input"
									className={buttonVariants({
										variant: 'outline',
										size: 'icon',
									})}
								>
									<Upload />
								</label>
							</TooltipComponent>
							<input
								type="file"
								accept=".csv"
								className="hidden"
								id="csv-input"
								value={[]}
								onChange={(e) => handleCSV(e.target.files)}
							/>
						</div>
						<Button onClick={addNewRow} size="sm">
							<Plus className="mr-2 size-4" /> Add Row
						</Button>
					</div>
				</If>

				<div className="max-h-96 max-w-full overflow-auto">
					<Table>
						<TableHeader className="bg-background sticky top-0 z-10">
							<TableRow>
								<ForEach
									data={keys}
									filter={(key) => !EXCLUDED_HEADERS_LS_SHEET.includes(key)}
								>
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
