import React, { memo } from 'react'
import { LSMappingGenders, LSMappingTypes } from '@/constants/ai-constants'
import { Trash2 } from 'lucide-react'

import IfElse, { Else, If } from '@/components/if-else'
import { Button } from '@/components/ui/button'
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
	({ item, index, removeRow, updateField }: LSEditorRowProps) => {
		return (
			<div className="grid grid-cols-5 gap-4 border-t p-4">
				<Input
					value={item['original_name']}
					onChange={(e) => updateField(index, 'original_name', e.target.value)}
					placeholder="original_name"
				/>
				<Input
					value={item['localised_name']}
					onChange={(e) => updateField(index, 'localised_name', e.target.value)}
					placeholder="localised_name"
				/>
				<Select
					value={item.type}
					onValueChange={(value) => updateField(index, 'type', value)}
				>
					<SelectTrigger>
						<SelectValue placeholder="Type" />
					</SelectTrigger>
					<SelectContent>
						{LSMappingTypes.map((type) => (
							<SelectItem key={type} value={type}>
								{type.toUpperCase()}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
				<IfElse condition={item.type === ELSMappingType.PERSON}>
					<If>
						<Select
							defaultValue={ELSMappingGender.MALE}
							value={item.gender}
							onValueChange={(value) => updateField(index, 'gender', value)}
						>
							<SelectTrigger>
								<SelectValue placeholder="Gender" />
							</SelectTrigger>
							<SelectContent>
								{LSMappingGenders.map((gender) => (
									<SelectItem key={gender} value={gender}>
										{gender}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</If>
					<Else>
						<div />
					</Else>
				</IfElse>
				<Button
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
