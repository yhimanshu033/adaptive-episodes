import React, { memo } from 'react'
import { EXCLUDED_HEADERS_LS_SHEET } from '@/constants/episodes-constants'

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
	updateField: (
		index: number,
		field: keyof LSMappingOutputItem,
		value: string | boolean
	) => void
}

const LSEditorRowV2 = memo(
	({
		item,
		index,
		updateField,
		disabled = false,
		rows = ['original_name', 'localised_name'],
	}: LSEditorRowV2Props) => {
		const custom_fields = ['is_deleted']

		return (
			<TableRow
				className={cn('', {
					'bg-fm-surface-secondary': index % 2 !== 0,
				})}
			>
				<ForEach
					data={rows}
					filter={(key) => !EXCLUDED_HEADERS_LS_SHEET.includes(key)}
				>
					{(key, idx) => (
						<TableCell key={idx}>
							<SwitchCase value={key}>
								<Case value="is_deleted">
									<Checkbox
										disabled={disabled}
										checked={Boolean(item[key])}
										onCheckedChange={(checked) =>
											updateField(index, 'is_deleted', checked)
										}
									/>
								</Case>
								<Case value={custom_fields.includes(key) ? '' : key}>
									<Input
										disabled={disabled}
										value={String(item[key] || '')}
										onChange={(e) => updateField(index, key, e.target.value)}
										placeholder={key.replace(/_/g, ' ').toLowerCase()}
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
					)}
				</ForEach>
			</TableRow>
		)
	}
)

LSEditorRowV2.displayName = 'LSEditorRowV2'

export default LSEditorRowV2
