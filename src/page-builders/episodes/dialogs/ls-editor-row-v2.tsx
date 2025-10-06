import React, { memo, useEffect, useState } from 'react'
import { EXCLUDED_HEADERS_LS_SHEET } from '@/constants/episodes-constants'
import { useDebounce } from '@/hooks/use-debounce'

import { Checkbox } from '@/components/aural-ui/checkbox'
import Input from '@/components/aural-ui/input'
import { TableCell, TableRow } from '@/components/aural-ui/table'
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
	const debouncedState = useDebounce(value, 500)

	useEffect(() => {
		updateField(index, field, debouncedState)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [debouncedState, field, index])

	return (
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
					<Input
						disabled={disabled}
						value={value}
						onChange={(e) => setValue(e.target.value)}
						placeholder={field.replace(/_/g, ' ').toLowerCase()}
						decoration="filled"
						classes={{
							input: cn('', {
								'border-0 pl-0 !text-fm-primary bg-transparent !cursor-text':
									disabled,
							}),
							wrapper: cn('min-w-32'),
						}}
					/>
				</Case>
			</SwitchCase>
		</TableCell>
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
