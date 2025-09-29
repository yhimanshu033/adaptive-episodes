import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { BubbleCheckIcon } from '@/icons/bubble-check-icon'
import { BubbleCrossedIcon } from '@/icons/bubble-crossed-icon'
import { DownloadIcon } from '@/icons/download-icon'
import { PlusIcon } from '@/icons/plus-icon'
import { UploadIcon } from '@/icons/upload-icon'
import { toast } from 'sonner'

import { Button } from '@/components/aural-ui/button'
import { Divider } from '@/components/aural-ui/divider'
import { IconButton } from '@/components/aural-ui/icon-button'
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from '@/components/aural-ui/tabs'
import { downloadBlobUrl } from '@/lib/utils/client-helpers'
import {
	cn,
	isInvalidLSMapping,
	parseCSV,
	toSnakeCase,
} from '@/lib/utils/helpers'

import {
	ELSMappingGender,
	ELSMappingType,
	LSMappingOutput,
	LSMappingOutputItem,
	LSMappingOutputItemV2,
} from '@/types/common'

import LSTableEditor from './ls-editor'

interface LsTabsProps {
	handleClose?: () => void
	onSubmit?: (data: LSMappingOutput) => void
	setTableData?: React.Dispatch<React.SetStateAction<LSMappingOutputItemV2>>
	tableData: LSMappingOutputItemV2
	viewOnly?: boolean
}

const TableCTAs = ({
	viewOnly,
	currentTabData,
	onDataChange,
}: {
	currentTabData: LSMappingOutputItem[]
	onDataChange: (data: LSMappingOutputItem[]) => void
	viewOnly: boolean
}) => {
	const addNewRow = () => {
		onDataChange([
			...currentTabData,
			{
				original_name: '',
				localised_name: '',
				type: ELSMappingType.PERSON,
				gender: ELSMappingGender.MALE,
			},
		])
	}

	function handleCSV(files: FileList | null) {
		const file = files?.[0]
		if (!file) {
			return
		}
		const reader = new FileReader()
		reader.onload = (event) => {
			const text = event.target?.result as string

			const rows = parseCSV(text.trim())

			const headers = rows[0].map((item) => toSnakeCase(item))
			const data = rows
				.slice(1)
				.filter((row) => {
					return row.some((cell) => cell && cell.trim() !== '')
				})
				.map((row) =>
					Object.fromEntries(row.map((val, i) => [headers[i], val]))
				) as LSMappingOutputItem[]

			onDataChange(data)
		}
		reader.onerror = () => {
			toast.error('Some error occurred while reading CSV', {
				icon: <BubbleCrossedIcon />,
			})
		}
		reader.readAsText(file)
		toast.success('CSV import completed!', {
			icon: <BubbleCheckIcon />,
		})
	}

	function handleDownloadCSV() {
		const headers = Object.keys(currentTabData[0] || {})
		const csvRows = [
			headers.join(','), // header row
			...currentTabData.map((row) =>
				headers
					.map(
						(header) =>
							`"${(row[header] ?? '').toString().replace(/"/g, '""')}"`
					)
					.join(',')
			),
		]

		const blob = new Blob([csvRows.join('\n') as BlobPart], {
			type: 'text/csv;charset=utf-8;',
		})
		const url = URL.createObjectURL(blob)
		downloadBlobUrl(url, `${new Date().toUTCString()}.csv`)
	}

	if (viewOnly) {
		return null
	}

	return (
		<div className="flex items-center gap-2">
			<IconButton
				label="Download Csv"
				tooltip="Download CSV"
				onClick={handleDownloadCSV}
				icon={<DownloadIcon className="size-6" />}
				shape="square"
				variant="ghost"
			/>
			<IconButton
				label="Upload CSV"
				tooltip="Upload CSV"
				onClick={() => document.getElementById('csv-input')?.click()}
				icon={<UploadIcon className="size-6" />}
				shape="square"
				variant="ghost"
			/>
			<input
				type="file"
				accept=".csv"
				className="hidden"
				id="csv-input"
				onChange={(e) => handleCSV(e.target.files)}
			/>
			<Button
				type="button"
				onClick={addNewRow}
				variant="outline"
				size="sm"
				leftIcon={<PlusIcon />}
			>
				Add Row
			</Button>
		</div>
	)
}

const ActionButtons = ({
	viewOnly,
	handleClose,
	hasInvalidData,
	handleSubmit,
}: {
	handleClose?: () => void
	handleSubmit: () => void
	hasInvalidData: boolean
	viewOnly: boolean
}) => {
	if (viewOnly) {
		return null
	}

	return (
		<>
			<div className="px-6">
				<Divider variant="dashed" />
			</div>
			<div className="flex justify-between border-dashed p-6">
				<Button variant="text" onClick={handleClose} innerClassName="!px-0">
					Exit & Discard
				</Button>
				<Button
					disabled={hasInvalidData}
					isDisabled={hasInvalidData}
					onClick={handleSubmit}
				>
					Save & Continue
				</Button>
			</div>
		</>
	)
}

const LsTabs = ({
	tableData = {},
	setTableData,
	onSubmit,
	handleClose,
	viewOnly = false,
}: LsTabsProps) => {
	const tabKeys = Object.keys(tableData)
	const [activeTab, setActiveTab] = useState(tabKeys[0] || '')

	const handleTabDataChange = useCallback(
		(tabKey: string, newData: LSMappingOutputItem[]) => {
			if (!setTableData) {
				return
			}

			setTableData((prevTableData) => ({
				...prevTableData,
				[tabKey]: newData,
			}))
		},
		[setTableData]
	)

	const hasInvalidData = useMemo(() => {
		return Object.values(tableData).some((tabData) =>
			isInvalidLSMapping(tabData)
		)
	}, [tableData])

	const handleSubmit = useCallback(() => {
		if (hasInvalidData) {
			return
		}
		if (onSubmit) {
			onSubmit({ ls_mapping: { ...tableData } })
		}
	}, [hasInvalidData, tableData, onSubmit])

	useEffect(() => {
		if (tabKeys.length > 0 && !activeTab) {
			setActiveTab(tabKeys[0])
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [tabKeys.length])

	if (tabKeys.length === 0) {
		return (
			<div className="text-muted-foreground flex h-full items-center justify-center">
				No LS mapping data available
			</div>
		)
	}

	const renderContent = () => {
		if (tabKeys.length === 1) {
			const singleTabKey = tabKeys[0]
			return (
				<div className="flex flex-1 flex-col">
					<div className="border-fm-divider-secondary flex items-center justify-end border-b px-6 pt-4 pb-3">
						<TableCTAs
							viewOnly={viewOnly}
							currentTabData={tableData[singleTabKey] || []}
							onDataChange={(newData) =>
								handleTabDataChange(singleTabKey, newData)
							}
						/>
					</div>
					<LSTableEditor
						tableData={tableData[singleTabKey] || []}
						setTableData={(newData) =>
							handleTabDataChange(singleTabKey, newData)
						}
						viewOnly={viewOnly}
					/>
				</div>
			)
		}

		return (
			<Tabs
				value={activeTab}
				onValueChange={setActiveTab}
				className="flex flex-1 flex-col"
			>
				<div className="border-fm-divider-secondary flex items-center justify-between border-b px-6 pt-4 pb-3">
					<TabsList className="bg-fm-surface-secondary rounded-xs p-1">
						{tabKeys.map((tabKey) => (
							<TabsTrigger
								key={tabKey}
								value={tabKey}
								className="flex-1 capitalize"
								size="sm"
							>
								{tabKey.replace(/_/g, ' ')}
							</TabsTrigger>
						))}
					</TabsList>
					<TableCTAs
						viewOnly={viewOnly}
						currentTabData={tableData[activeTab] || []}
						onDataChange={(newData) => handleTabDataChange(activeTab, newData)}
					/>
				</div>

				{tabKeys.map((tabKey) => (
					<TabsContent key={tabKey} value={tabKey} className="mt-0 flex-1">
						<LSTableEditor
							tableData={tableData[tabKey] || []}
							setTableData={(newData) => handleTabDataChange(tabKey, newData)}
							viewOnly={viewOnly}
						/>
					</TabsContent>
				))}
			</Tabs>
		)
	}

	return (
		<div
			className={cn('flex h-full flex-col', {
				'h-[calc(100%-64px)]': viewOnly,
			})}
		>
			<div className="flex-1">{renderContent()}</div>
			<ActionButtons
				viewOnly={viewOnly}
				handleClose={handleClose}
				hasInvalidData={hasInvalidData}
				handleSubmit={handleSubmit}
			/>
		</div>
	)
}

export default LsTabs
