import React, { memo, useEffect, useState } from 'react'
import { LARGE_TEXT_THRESHOLD } from '@/constants/adaptation-constants'
import { EXCLUDED_HEADERS_LS_SHEET } from '@/constants/episodes-constants'
import { useDebounce } from '@/hooks/use-debounce'
import { ArrowRightUpIcon } from '@/icons/arrow-right-up-icon'

import { Button } from '@/components/aural-ui/button'
import { Checkbox } from '@/components/aural-ui/checkbox'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/aural-ui/dialog'
import { IconButton } from '@/components/aural-ui/icon-button'
import Input from '@/components/aural-ui/input'
import { TableCell, TableRow } from '@/components/aural-ui/table'
import TextArea from '@/components/aural-ui/textarea'
import SwitchCase, { Case } from '@/components/switch-case'
import ForEach from '@/components/ui/for-each'
import { cn } from '@/lib/utils/helpers'

import { LSMappingOutputItem } from '@/types/common'

interface LSEditorRowV2Props {
	disabled?: boolean
	index: number
	item: LSMappingOutputItem
	removeRow: (index: number) => void
	rows?: string[]
	style?: React.CSSProperties
	updateField: (
		index: number,
		field: keyof LSMappingOutputItem,
		value: string | boolean
	) => void
}

const custom_fields = ['is_deleted']

interface LSEditorCellProps {
	disabled?: boolean
	field: string
	idx: number
	index: number
	item: LSMappingOutputItem
	updateField: (
		index: number,
		field: keyof LSMappingOutputItem,
		value: string | boolean
	) => void
}

const LSEditorCell = ({
	idx,
	item,
	updateField,
	disabled,
	field,
	index,
}: LSEditorCellProps) => {
	const [value, setValue] = useState(String(item[field] || ''))
	const [isDialogOpen, setIsDialogOpen] = useState(false)
	const [dialogValue, setDialogValue] = useState(value)
	const debouncedState = useDebounce(value, 500)

	useEffect(() => {
		updateField(index, field, debouncedState)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [debouncedState, field, index])

	useEffect(() => {
		if (isDialogOpen) {
			setDialogValue(value)
		}
	}, [isDialogOpen, value])

	const isLargeTextField = value.length > LARGE_TEXT_THRESHOLD
	const showExpandIcon = isLargeTextField && !disabled

	const handleDialogSave = () => {
		setValue(dialogValue)
		setIsDialogOpen(false)
	}
	return (
		<>
			<TableCell key={idx}>
				<SwitchCase value={field}>
					<Case value="is_deleted">
						<Checkbox
							disabled={disabled}
							checked={Boolean(item[field])}
							onCheckedChange={(checked) =>
								updateField(index, 'is_deleted', checked)
							}
						/>
					</Case>
					<Case value={custom_fields.includes(field) ? '' : field}>
						<div className="relative">
							<Input
								disabled={disabled}
								value={value}
								onChange={(e) => setValue(e.target.value)}
								placeholder={field.replace(/_/g, ' ').toLowerCase()}
								decoration="filled"
								classes={{
									input: cn({
										'border-0 pl-0 text-fm-primary! bg-transparent cursor-text!':
											disabled,
										'pr-8': showExpandIcon,
									}),
									wrapper: cn('min-w-32'),
								}}
							/>
							{showExpandIcon && (
								<IconButton
									label="Expand to full editor"
									variant="ghost"
									size="small"
									className="absolute top-[calc(50%+2px)] right-0 -translate-y-1/2 hover:bg-transparent"
									aria-label="Expand to full editor"
									icon={<ArrowRightUpIcon width={12} height={12} />}
									onClick={() => setIsDialogOpen(true)}
								/>
							)}
						</div>
					</Case>
				</SwitchCase>
			</TableCell>

			<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
				<DialogContent
					noise="none"
					className="bg-fm-surface-primary min-w-[50vw]"
					glass="medium"
					opacity="medium"
					classes={{
						overlay: 'z-60',
						content: 'z-70',
					}}
				>
					<DialogHeader>
						<DialogTitle>
							Edit {field.replace(/_/g, ' ').toLowerCase()}
						</DialogTitle>
					</DialogHeader>
					<div className="space-y-4">
						<TextArea
							value={dialogValue}
							onChange={(e) => setDialogValue(e.target.value)}
							placeholder={field.replace(/_/g, ' ').toLowerCase()}
							rows={10}
							autoGrow
							maxHeight={400}
							showCharCount
							maxLength={5000}
							decoration="filled"
						/>
						<div className="flex justify-end gap-3">
							<Button
								type="button"
								onClick={() => setIsDialogOpen(false)}
								variant="outline"
								size="sm"
							>
								Cancel
							</Button>
							<Button size="sm" type="button" onClick={handleDialogSave}>
								Save
							</Button>
						</div>
					</div>
				</DialogContent>
			</Dialog>
		</>
	)
}

const LSEditorRowV2 = memo(
	({
		item,
		index,
		updateField,
		disabled = false,
		rows = ['original_name', 'localised_name'],
		style = {},
	}: LSEditorRowV2Props) => {
		return (
			<TableRow
				className={cn('', {
					'bg-fm-surface-secondary': index % 2 !== 0,
				})}
				style={style}
			>
				<ForEach
					data={rows}
					filter={(key) => !EXCLUDED_HEADERS_LS_SHEET.includes(key)}
				>
					{(key, idx) => (
						<LSEditorCell
							key={`${index}-${idx}-${key}`}
							idx={idx}
							index={index}
							item={item}
							field={key}
							updateField={updateField}
							disabled={disabled}
						/>
					)}
				</ForEach>
			</TableRow>
		)
	}
)

LSEditorRowV2.displayName = 'LSEditorRowV2'

export default LSEditorRowV2
