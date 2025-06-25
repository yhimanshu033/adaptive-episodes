import React, { memo, useCallback, useMemo } from 'react'
import { EXCLUDED_HEADERS_LS_SHEET } from '@/constants/episodes-constants'
import { BubbleCheckIcon } from '@/icons/bubble-check-icon'
import { DownloadIcon } from '@/icons/download-icon'
import { PlusIcon } from '@/icons/plus-icon'
import { UploadIcon } from '@/icons/upload-icon'
import LSEditorRow from '@/page-builders/episodes/dialogs/ls-editor-row'
import { toast } from 'sonner'

import { Button } from '@/components/aural-ui/button'
import { Divider } from '@/components/aural-ui/divider'
import {
	IconButton,
	iconButtonVariants,
} from '@/components/aural-ui/icon-button'
import { If } from '@/components/aural-ui/if-else'
import {
	Table,
	TableBody,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/aural-ui/table'
import ForEach from '@/components/ui/for-each'
import { TooltipComponent } from '@/components/ui/tooltip-component'
import { downloadBlobUrl } from '@/lib/utils/client-helpers'
import {
	cn,
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
		handleClose = () => {},
		viewOnly = false,
	}: {
		handleClose?: () => void
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
			toast.success('CSV import completed!', {
				icon: <BubbleCheckIcon />,
			})
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
			<div
				className={cn('flex h-full flex-col gap-4', {
					'h-[calc(100%-64px)]': viewOnly,
				})}
			>
				<div className="flex h-full flex-col gap-4 overflow-x-auto">
					<If condition={!viewOnly}>
						<div className="flex items-center justify-end gap-2 px-6">
							<IconButton
								label="Download Csv"
								tooltip="Download CSV"
								onClick={handleDownloadCSV}
								icon={<DownloadIcon className="size-6" />}
								shape="square"
								variant="ghost"
							/>
							<TooltipComponent tooltip="Upload CSV">
								<label
									htmlFor="csv-input"
									className={iconButtonVariants({
										variant: 'ghost',
										shape: 'square',
									})}
								>
									<UploadIcon />
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
							<Button
								variant="outline"
								onClick={addNewRow}
								size="sm"
								leftIcon={<PlusIcon />}
							>
								Add Row
							</Button>
						</div>
					</If>

					<div className="h-full max-w-full overflow-y-auto px-6">
						<Table className="bg-transparent">
							<TableHeader className="bg-fm-surface-secondary sticky top-0 z-10">
								<TableRow className="min-h-12">
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
				</div>
				<If condition={!viewOnly}>
					<div className="px-6">
						<Divider variant="dashed" />
					</div>
					<div className="flex justify-between border-dashed p-6">
						<Button variant="text" onClick={handleClose} innerClassName="!px-0">
							Exit & Discard
						</Button>
						<Button
							disabled={disabled}
							isDisabled={disabled}
							onClick={handleSubmit}
						>
							Save & Continue
						</Button>
					</div>
				</If>
			</div>
		)
	}
)

LSTableEditor.displayName = 'LSTableEditor'
export default LSTableEditor
