import React from 'react'
import { TickIcon } from '@/icons/tick-icon'
import { getMultiSelectOptions } from '@/page-builders/episodes/outliner-questionnaire/lib/fns'
import { TWriterProfileKey } from '@/page-builders/episodes/outliner-questionnaire/lib/types'
import useOutlinerQuestionnaire from '@/page-builders/episodes/outliner-questionnaire/provider'
import { Edit2 } from 'lucide-react'

import { IconButton } from '@/components/aural-ui/icon-button'
import { Else, If, IfElse } from '@/components/aural-ui/if-else'
import TextArea from '@/components/aural-ui/textarea'
import { MultiSelect } from '@/components/ui/multi-select'

interface IWriterProfileCardProps {
	field: TWriterProfileKey
}
export default function WriterProfileCard({ field }: IWriterProfileCardProps) {
	const { writerProfileDataState, handleChangeWriterProfileStateField } =
		useOutlinerQuestionnaire()
	const currentField = writerProfileDataState?.[field]

	const isEditing = currentField?.isEditing
	if (!currentField) {
		return null
	}
	return (
		<div className="border-fm-divider-primary space-y-1 border p-4">
			<div className="flex justify-between">
				<h3 className="font-fm-brand uppercase">{currentField.title}</h3>
				{/* DISABLED FOR NOW */}
				<If>
					<div className="flex gap-2">
						<IconButton
							label={isEditing ? 'Save' : 'Edit'}
							tooltip={isEditing ? 'Save' : 'Edit'}
							onClick={() => {
								handleChangeWriterProfileStateField({
									field,
									data: { isEditing: !isEditing },
								})
							}}
							icon={isEditing ? <TickIcon /> : <Edit2 />}
							size="small"
							variant="ghost"
						/>
					</div>
				</If>
			</div>
			<IfElse condition={currentField.isMultiSelect}>
				<If>
					<MultiSelect
						selected={getMultiSelectOptions(currentField.value)}
						// disabled={!currentField.isEditing}
						onSelect={(option) => {
							handleChangeWriterProfileStateField({
								field,
								data: { value: [...currentField.value, option.value] },
							})
						}}
						onUnSelect={(option) => {
							handleChangeWriterProfileStateField({
								field,
								data: {
									value: (currentField.value as string[]).filter?.(
										(item) => item !== option.value
									),
								},
							})
						}}
					/>
				</If>
				<Else>
					<TextArea
						classes={{
							textarea: 'bg-transparent px-1! py-1! outline-none! border-none!',
						}}
						placeholder="Type here..."
						value={String(currentField.value || '')}
						onChange={(e) => {
							handleChangeWriterProfileStateField({
								field,
								data: { value: e.target.value },
							})
						}}
					/>
				</Else>
			</IfElse>
		</div>
	)
}
