import React, { memo, useMemo, useRef } from 'react'
import { EXCLUDED_HEADERS_LS_SHEET } from '@/constants/episodes-constants'
import LSEditorRowV2 from '@/page-builders/episodes/dialogs/ls-editor-row-v2'
import { useVirtualizer } from '@tanstack/react-virtual'

import { If } from '@/components/aural-ui/if-else'
import { ScrollArea, ScrollBar } from '@/components/aural-ui/scroll-area'
import {
	Table,
	TableBody,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/aural-ui/table'
import ForEach from '@/components/ui/for-each'

import { LSMappingOutputItem } from '@/types/common'

const ROW_HEIGHT = 76
const COL_WIDTH = 180

interface LSTableEditorProps {
	columnSequence?: string[]
	setTableData?: (data: LSMappingOutputItem[]) => void
	tableData?: LSMappingOutputItem[]
	viewOnly?: boolean
	visibleRows?: number
}
const LSTableEditor = memo(
	({
		tableData = [],
		setTableData = () => {},
		viewOnly = false,
		columnSequence = [],
		visibleRows = 6,
	}: LSTableEditorProps) => {
		const columnSequenceMap = useMemo(() => {
			return columnSequence.reduce(
				(acc, curr, currIdx) => {
					return {
						...acc,
						[curr]: currIdx,
					}
				},
				{} as Record<string, number>
			)
		}, [columnSequence])

		const keys = useMemo(() => {
			const cols = Object.keys(tableData[0] || {})
			return cols.sort((a, b) => {
				const aIdx =
					a in columnSequenceMap
						? columnSequenceMap[a]
						: Number.MAX_SAFE_INTEGER
				const bIdx =
					b in columnSequenceMap
						? columnSequenceMap[b]
						: Number.MAX_SAFE_INTEGER
				return aIdx - bIdx
			})
		}, [tableData, columnSequenceMap])
		const parentRef = useRef<HTMLDivElement>(null)

		const keysToDisplay = useMemo(() => {
			return keys.filter((key) => !EXCLUDED_HEADERS_LS_SHEET.includes(key))
		}, [keys])

		const virtualizer = useVirtualizer({
			count: tableData.length,
			getScrollElement: () => parentRef.current,
			estimateSize: () => ROW_HEIGHT, // Estimated row height
			overscan: 5, // Number of items to render outside of the visible area
		})

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
			<ScrollArea className="max-w-full">
				<ScrollBar orientation="horizontal" />
				<div
					className="relative max-w-full overflow-y-scroll"
					ref={parentRef}
					style={{
						height: ROW_HEIGHT * visibleRows,
						minWidth: COL_WIDTH * keysToDisplay.length,
					}}
				>
					<Table className="bg-transparent">
						<TableHeader className="bg-fm-surface-secondary sticky top-0 z-10">
							<TableRow
								className="grid min-h-12"
								style={{
									gridTemplateColumns: `repeat(${keysToDisplay.length}, minmax(0, 1fr))`,
								}}
							>
								<ForEach data={keysToDisplay}>
									{(item, idx) => <TableHead key={idx}>{item}</TableHead>}
								</ForEach>
							</TableRow>
						</TableHeader>
						<TableBody
							style={{
								height: `${virtualizer.getTotalSize()}px`,
								width: '100%',
								position: 'relative',
							}}
						>
							<If condition={tableData.length === 0}>
								<div className="text-muted-foreground p-4 text-center">
									No data available.
								</div>
							</If>

							<If condition={tableData.length > 0}>
								{virtualizer.getVirtualItems().map((virtualItem) => {
									const item = tableData[virtualItem.index]
									return (
										<LSEditorRowV2
											rows={keys}
											disabled={viewOnly}
											index={virtualItem.index}
											item={item}
											removeRow={removeRow}
											updateField={updateField}
											key={virtualItem.key}
											style={{
												position: 'absolute',
												top: 0,
												left: 0,
												width: '100%',
												height: `${virtualItem.size}px`,
												transform: `translateY(${virtualItem.start}px)`,
												gridTemplateColumns: `repeat(${keysToDisplay.length}, minmax(0, 1fr))`,
												display: 'grid',
												alignItems: 'center',
											}}
										/>
									)
								})}
							</If>
						</TableBody>
					</Table>
				</div>
			</ScrollArea>
		)
	}
)

LSTableEditor.displayName = 'LSTableEditor'
export default LSTableEditor
