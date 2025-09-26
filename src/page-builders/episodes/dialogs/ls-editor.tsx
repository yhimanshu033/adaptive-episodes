import React, { memo, useMemo } from 'react'
import { EXCLUDED_HEADERS_LS_SHEET } from '@/constants/episodes-constants'
import LSEditorRowV2 from '@/page-builders/episodes/dialogs/ls-editor-row-v2'

import { If } from '@/components/aural-ui/if-else'
import {
	Table,
	TableBody,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/aural-ui/table'
import ForEach from '@/components/ui/for-each'

import { LSMappingOutputItem } from '@/types/common'

const LSTableEditor = memo(
	({
		tableData = [],
		setTableData = () => {},
		viewOnly = false,
	}: {
		setTableData?: (data: LSMappingOutputItem[]) => void
		tableData?: LSMappingOutputItem[]
		viewOnly?: boolean
	}) => {
		const keys = useMemo(() => Object.keys(tableData[0] || {}), [tableData])

		const removeRow = (index: number) => {
			setTableData(tableData.filter((_, i) => i !== index))
		}

		const updateField = (
			index: number,
			field: keyof LSMappingOutputItem,
			value: string | boolean
		) => {
			const updatedData = [...tableData]
			updatedData[index] = {
				...updatedData[index],
				[field]: value as string,
			}
			setTableData(updatedData)
		}

		return (
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
								<LSEditorRowV2
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
		)
	}
)

LSTableEditor.displayName = 'LSTableEditor'
export default LSTableEditor
