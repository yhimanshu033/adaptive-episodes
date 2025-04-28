import React, { memo } from 'react'
import { LSMappingGenders, LSMappingTypes } from '@/constants/ai-constants'
import { Trash2 } from 'lucide-react'

import IfElse, { Else, If } from '@/components/if-else'
import { Button } from '@/components/ui/button'
import ForEach from '@/components/ui/for-each'
import { Input } from '@/components/ui/input'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'

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
	updateField: (
		index: number,
		field: keyof LSMappingOutputItem,
		value: string
	) => void
}
const LSEditorRow = memo(
	({
		item,
		index,
		removeRow,
		updateField,
		disabled = false,
	}: LSEditorRowProps) => {
		return (
			<div className="grid grid-cols-5 gap-4 border-t p-4">
				<Input
					disabled={disabled}
					value={item['original_name']}
					onChange={(e) => updateField(index, 'original_name', e.target.value)}
					placeholder="original_name"
				/>
				<Input
					disabled={disabled}
					value={item['localised_name']}
					onChange={(e) => updateField(index, 'localised_name', e.target.value)}
					placeholder="localised_name"
				/>
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
				<IfElse condition={item.type === ELSMappingType.PERSON}>
					<If>
						<Select
							disabled={disabled}
							defaultValue={ELSMappingGender.MALE}
							value={item.gender}
							onValueChange={(value) => updateField(index, 'gender', value)}
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
				<Button
					disabled={disabled}
					variant="destructive"
					size="icon"
					onClick={() => removeRow(index)}
				>
					<Trash2 className="size-4" />
				</Button>
			</div>
		)
	}
)

LSEditorRow.displayName = 'LSEditorRow'

export default LSEditorRow
