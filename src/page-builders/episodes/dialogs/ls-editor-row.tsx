import React, { memo } from 'react'
import { LSMappingGenders, LSMappingTypes } from '@/constants/ai-constants'

import IfElse, { Else, If } from '@/components/if-else'
import SwitchCase, { Case } from '@/components/switch-case'
import { Checkbox } from '@/components/ui/checkbox'
import ForEach from '@/components/ui/for-each'
import { Input } from '@/components/ui/input'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { TableCell, TableRow } from '@/components/ui/table'

import {
	ELSMappingGender,
	ELSMappingType,
	LSMappingOutputItem,
} from '@/types/common'

interface LSEditorRowProps {
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
const LSEditorRow = memo(
	({
		item,
		index,
		updateField,
		disabled = false,
		rows = ['original_name', 'localised_name'],
	}: LSEditorRowProps) => {
		const custom_fields = ['type', 'gender', 'is_deleted']
		return (
			<TableRow>
				<ForEach data={rows}>
					{(key, idx) => (
						<TableCell key={idx}>
							<SwitchCase value={key}>
								<Case value={'type'}>
									<Select
										disabled={disabled}
										value={item.type}
										onValueChange={(value) => updateField(index, 'type', value)}
									>
										<SelectTrigger>
											<SelectValue placeholder="Type" />
										</SelectTrigger>
										<SelectContent>
											<ForEach data={LSMappingTypes}>
												{(type) => (
													<SelectItem key={type} value={type}>
														{type.toUpperCase()}
													</SelectItem>
												)}
											</ForEach>
										</SelectContent>
									</Select>
								</Case>
								<Case value="gender">
									<IfElse condition={item.type === ELSMappingType.PERSON}>
										<If>
											<Select
												disabled={disabled}
												defaultValue={ELSMappingGender.MALE}
												value={item.gender}
												onValueChange={(value) =>
													updateField(index, 'gender', value)
												}
											>
												<SelectTrigger>
													<SelectValue placeholder="Gender" />
												</SelectTrigger>
												<SelectContent>
													<ForEach data={LSMappingGenders}>
														{(gender) => (
															<SelectItem key={gender} value={gender}>
																{gender}
															</SelectItem>
														)}
													</ForEach>
												</SelectContent>
											</Select>
										</If>
										<Else>
											<div />
										</Else>
									</IfElse>
								</Case>
								<Case value="is_deleted">
									<Checkbox
										disabled={disabled}
										onCheckedChange={(checked) =>
											updateField(index, 'is_deleted', checked)
										}
									/>
								</Case>
								<Case value={custom_fields.includes(key) ? '' : key}>
									<Input
										disabled={disabled}
										value={item[key]}
										onChange={(e) => updateField(index, key, e.target.value)}
										placeholder={key}
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

LSEditorRow.displayName = 'LSEditorRow'

export default LSEditorRow
