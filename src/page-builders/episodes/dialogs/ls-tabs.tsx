import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { BubbleCheckIcon } from '@/icons/bubble-check-icon'
import { BubbleCrossedIcon } from '@/icons/bubble-crossed-icon'
import { DownloadIcon } from '@/icons/download-icon'
import { PlusIcon } from '@/icons/plus-icon'
import { UploadIcon } from '@/icons/upload-icon'
import { toast } from 'sonner'
import * as XLSX from 'xlsx'

import { Button } from '@/components/aural-ui/button'
import { Divider } from '@/components/aural-ui/divider'
import { IconButton } from '@/components/aural-ui/icon-button'
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from '@/components/aural-ui/tabs'
import { cn, getFormattedDate, isInvalidLSMapping } from '@/lib/utils/helpers'

import {
	ELSMappingGender,
	ELSMappingType,
	LSMappingOutput,
	LSMappingOutputItem,
	LSMappingOutputItemV2,
} from '@/types/common'
import { TStory } from '@/types/story-types'

import LSTableEditor from './ls-editor'

interface LsTabsProps {
	handleClose?: () => void
	onSubmit?: (data: LSMappingOutput) => void
	setTableData?: React.Dispatch<React.SetStateAction<LSMappingOutputItemV2>>
	story?: TStory | null
	tableData: LSMappingOutputItemV2
	viewOnly?: boolean
}

const TableCTAs = ({
	viewOnly,
	currentTabData,
	onDataChange,
	onWorkBookChange,
	setActiveTab,
	currentWorkbook,
	story,
}: {
	currentTabData: LSMappingOutputItem[]
	currentWorkbook?: LSMappingOutputItemV2
	onDataChange: (data: LSMappingOutputItem[]) => void
	onWorkBookChange?: (data: LSMappingOutputItemV2) => void
	setActiveTab?: (tab: string) => void
	story?: TStory | null
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

	function handleXlsxUpload(files: FileList | null) {
		const file = files?.[0]
		if (!file) {
			return
		}

		const reader = new FileReader()

		reader.onload = (event) => {
			const data = new Uint8Array(event.target?.result as ArrayBuffer)
			const workbook = XLSX.read(data, { type: 'array' })

			const parsedWorkbook = workbook.SheetNames.reduce((acc, curr) => {
				return {
					...acc,
					[curr]: XLSX.utils.sheet_to_json<LSMappingOutputItem>(
						workbook.Sheets[curr]
					),
				}
			}, {} as LSMappingOutputItemV2)

			const firstSheetName = Object.keys(parsedWorkbook)[0]

			if (Object.keys(parsedWorkbook).length === 1 || !onWorkBookChange) {
				onDataChange(parsedWorkbook[firstSheetName])
			} else {
				onWorkBookChange(parsedWorkbook)
				setActiveTab?.(firstSheetName)
			}

			toast.success('XLSX import completed!', {
				icon: <BubbleCheckIcon />,
			})
		}

		reader.onerror = () => {
			toast.error('Some error occurred while reading XLSX', {
				icon: <BubbleCrossedIcon />,
			})
		}

		reader.readAsArrayBuffer(file)
	}

	function handleDownloadXlsx() {
		const workbook = XLSX.utils.book_new()

		Object.entries(currentWorkbook || {}).forEach(([sheetName, rows]) => {
			const worksheet = XLSX.utils.json_to_sheet(rows)
			XLSX.utils.book_append_sheet(workbook, worksheet, sheetName)
		})

		const filePrefix = story ? `${story?.project_title} - ` : ''

		XLSX.writeFile(
			workbook,
			`${filePrefix}LS Sheet - ${getFormattedDate()}.xlsx`
		)
	}

	if (viewOnly) {
		return null
	}

	return (
		<div className="flex items-center gap-2">
			<IconButton
				label="Download Csv"
				tooltip="Download CSV"
				onClick={handleDownloadXlsx}
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
				accept=".xlsx, .csv"
				className="hidden"
				id="csv-input"
				onChange={(e) => handleXlsxUpload(e.target.files)}
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
	story,
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
							story={story}
							onWorkBookChange={setTableData}
							setActiveTab={setActiveTab}
							currentWorkbook={tableData || {}}
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
						onWorkBookChange={setTableData}
						setActiveTab={setActiveTab}
						currentWorkbook={tableData || {}}
						story={story}
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
