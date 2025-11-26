import React from 'react'
import { TickIcon } from '@/icons/tick-icon'
import { storyDataKeyToRegenerateEnabled } from '@/page-builders/episodes/outliner-questionnaire/lib/constants'
import {
	addElementToStrArr,
	getMultiSelectOptions,
	removeElementFromStrArr,
	strArrToArr,
} from '@/page-builders/episodes/outliner-questionnaire/lib/fns'
import {
	TStoryDataKey,
	TStoryIdeaDataState,
	TStoryIdeaDataStateItem,
} from '@/page-builders/episodes/outliner-questionnaire/lib/types'
import { Edit2, RotateCcw } from 'lucide-react'

import { IconButton } from '@/components/aural-ui/icon-button'
import { Else, If, IfElse } from '@/components/aural-ui/if-else'
import TextArea from '@/components/aural-ui/textarea'
import { MultiSelect } from '@/components/ui/multi-select'

interface IStoryIdeaCardProps {
	disabled?: boolean
	field: TStoryDataKey
	handleChangeStoryDataStateField?: (data: {
		data: Partial<TStoryIdeaDataStateItem>
		field: TStoryDataKey
		idx: number
	}) => void
	idx: number
	storyIdeaState?: TStoryIdeaDataState
}
export default function StoryIdeaCard({
	field,
	idx,
	storyIdeaState,
	disabled,
	handleChangeStoryDataStateField,
}: IStoryIdeaCardProps) {
	const currentField = storyIdeaState?.[field]
	const isEditing = currentField?.isEditing

	if (!currentField) {
		return null
	}
	return (
		<div className="border-fm-divider-primary space-y-1 border p-4">
			<div className="flex justify-between">
				<h3 className="font-fm-brand uppercase">{currentField.title}</h3>
				<div className="flex gap-2">
					<If condition={storyDataKeyToRegenerateEnabled[field]}>
						<IconButton
							label="Regenerate"
							tooltip="Regenerate"
							icon={<RotateCcw />}
							disabled={disabled}
							size="small"
							variant="ghost"
						/>
					</If>
					{/* DISABLED FOR NOW */}
					<If>
						<IconButton
							label={isEditing ? 'Save' : 'Edit'}
							tooltip={isEditing ? 'Save' : 'Edit'}
							onClick={() => {
								handleChangeStoryDataStateField?.({
									field,
									data: { isEditing: !isEditing },
									idx,
								})
							}}
							icon={isEditing ? <TickIcon /> : <Edit2 />}
							size="small"
							disabled={disabled}
							variant="ghost"
						/>
					</If>
				</div>
			</div>
			<IfElse condition={currentField.isMultiSelect}>
				<If>
					<MultiSelect
						selected={getMultiSelectOptions(
							strArrToArr({ arr: currentField.value })
						)}
						disabled={!currentField.isEditing || disabled}
						onSelect={(option) => {
							handleChangeStoryDataStateField?.({
								idx,
								field,
								data: {
									value: addElementToStrArr({
										arr: currentField.value,
										elem: option.value,
									}),
								},
							})
						}}
						onUnSelect={(option) => {
							handleChangeStoryDataStateField?.({
								idx,
								field,
								data: {
									value: removeElementFromStrArr({
										arr: currentField.value,
										elem: option.value,
									}),
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
						disabled={disabled}
						value={String(currentField.value || '')}
						onChange={(e) => {
							handleChangeStoryDataStateField?.({
								idx,
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
