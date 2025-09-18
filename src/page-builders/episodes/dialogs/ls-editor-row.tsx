import React, { memo, useMemo } from 'react'
import {
	LSMappingChineseGenders,
	LSMappingGenders,
	LSMappingTypes,
} from '@/constants/ai-constants'
import { EXCLUDED_HEADERS_LS_SHEET } from '@/constants/episodes-constants'

import { Checkbox } from '@/components/aural-ui/checkbox'
import { Else, If, IfElse } from '@/components/aural-ui/if-else'
import Input from '@/components/aural-ui/input'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/aural-ui/select'
import { TableCell, TableRow } from '@/components/aural-ui/table'
import SwitchCase, { Case } from '@/components/switch-case'
import ForEach from '@/components/ui/for-each'
import { cn, isUpperCase } from '@/lib/utils/helpers'

import {
	ELSMappingChineseGender,
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
		const defaultGender = useMemo(() => {
			if (!item?.gender) {
				return ELSMappingGender.MALE
			}
			if (isUpperCase(item?.gender?.[0])) {
				return ELSMappingGender.MALE
			}
			return ELSMappingChineseGender.MALE
		}, [item])
		const genders = useMemo(() => {
			if (isUpperCase(defaultGender[0])) {
				return LSMappingGenders
			}
			return LSMappingChineseGenders
		}, [defaultGender]) as unknown as ELSMappingGender[]
		return (
			<TableRow
				className={cn('', { 'bg-fm-surface-secondary': index % 2 !== 0 })}
			>
				<ForEach
					data={rows}
					filter={(key) => !EXCLUDED_HEADERS_LS_SHEET.includes(key)}
				>
					{(key, idx) => (
						<TableCell key={idx}>
							<SwitchCase value={key}>
								<Case value={'type'}>
									<Select
										disabled={disabled}
										value={item.type}
										onValueChange={(value) => updateField(index, 'type', value)}
									>
										<SelectTrigger
											decoration="filled"
											classes={{
												root: cn('', {
													'border-0 bg-fm-transparent pl-0 !cursor-text':
														disabled,
												}),
												icon: cn('', { hidden: disabled }),
											}}
										>
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
												defaultValue={defaultGender}
												value={item.gender}
												onValueChange={(value) =>
													updateField(index, 'gender', value)
												}
											>
												<SelectTrigger
													decoration="filled"
													classes={{
														root: cn({
															'border-0 bg-fm-transparent pl-0 !cursor-text':
																disabled,
														}),
														icon: cn({ hidden: disabled }),
													}}
												>
													<SelectValue placeholder="Gender" />
												</SelectTrigger>
												<SelectContent>
													<ForEach data={genders}>
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
										decoration="filled"
										classes={{
											input: cn('', {
												'border-0 pl-0 !text-fm-primary w-32 bg-transparent !cursor-text':
													disabled,
											}),
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

LSEditorRow.displayName = 'LSEditorRow'

export default LSEditorRow
