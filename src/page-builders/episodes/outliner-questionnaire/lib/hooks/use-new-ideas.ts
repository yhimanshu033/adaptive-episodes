import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useDebounce } from '@/hooks/use-debounce'
import { convertStoryStateArrToMap } from '@/page-builders/episodes/outliner-questionnaire/lib/fns'
import { useOutlinerQuestionnaireNewIdeasMutation } from '@/page-builders/episodes/outliner-questionnaire/lib/hooks/use-outliner-questionnaire-new-ideas'
import {
	TStoryDataKey,
	TStoryIdeaData,
	TStoryIdeaDataState,
	TStoryIdeaDataStateItem,
} from '@/page-builders/episodes/outliner-questionnaire/lib/types'
import { isEqual } from 'lodash'

export default function useNewIdeas() {
	const [storyIdeaDataState, setStoryIdeaDataState] = useState<
		TStoryIdeaDataState[]
	>([])
	const [selectedStoryIdeaState, setSelectedStoryIdeaState] = useState(0)

	const storyDataMap = useMemo(() => {
		return convertStoryStateArrToMap(storyIdeaDataState)
	}, [storyIdeaDataState])

	const debouncedStoryData =
		useDebounce<Record<string, TStoryIdeaData>>(storyDataMap)

	const savedStoryData = useRef<typeof debouncedStoryData>(null)
	const {
		mutateAsync: updateOutlinerStoryIdea,
		isPending: isUpdateOutlinerStoryIdeaPending,
	} = useOutlinerQuestionnaireNewIdeasMutation()

	const handleChangeStoryDataStateField = useCallback(
		({
			data,
			field,
			idx,
		}: {
			data: Partial<TStoryIdeaDataStateItem>
			field: TStoryDataKey
			idx: number
		}) => {
			setStoryIdeaDataState((prev) => {
				return prev.map((it, ind) => {
					if (ind !== idx) {
						return it
					}
					return {
						...it,
						[field]: {
							...it[field],
							...data,
						},
					}
				})
			})
		},
		[]
	)

	useEffect(() => {
		if (
			!debouncedStoryData ||
			Object.keys(debouncedStoryData).length === 0 ||
			isEqual(savedStoryData.current, debouncedStoryData)
		) {
			return
		}
		void updateOutlinerStoryIdea({
			new_story_ideas: Object.values(debouncedStoryData),
		})
		savedStoryData.current = debouncedStoryData
	}, [debouncedStoryData, updateOutlinerStoryIdea])

	return {
		storyIdeaDataState,
		setStoryIdeaDataState,
		selectedStoryIdeaState,
		setSelectedStoryIdeaState,
		isUpdateOutlinerStoryIdeaPending,
		savedStoryData,
		handleChangeStoryDataStateField,
	}
}
