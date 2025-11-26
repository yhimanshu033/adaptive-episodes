import React, { useEffect } from 'react'
import { useOutlinerQuestionnaireNewIdeasQuery } from '@/page-builders/episodes/outliner-questionnaire/lib/hooks/use-outliner-questionnaire-new-ideas'
import OutlinerLoading from '@/page-builders/episodes/outliner-questionnaire/loading'
import StoryIdeaUI from '@/page-builders/episodes/outliner-questionnaire/story-idea-ui'
import useOutliner from '@/page-builders/plate-editor/sidebar-sections/outliner/provider'

export default function OutlinerNewIdeas() {
	const {
		storyIdeaDataState,
		handleInitialNewIdeasFetch,
		handleChangeStoryDataStateField,
	} = useOutliner()
	const { data: fetchedData, isPending } =
		useOutlinerQuestionnaireNewIdeasQuery()

	useEffect(() => {
		if (!fetchedData) {
			return
		}

		handleInitialNewIdeasFetch(fetchedData)
	}, [fetchedData, handleInitialNewIdeasFetch])

	if (isPending || !storyIdeaDataState?.length) {
		return <OutlinerLoading />
	}

	return (
		<StoryIdeaUI
			className="px-0"
			idx={0}
			handleChangeStoryDataStateField={handleChangeStoryDataStateField}
			storyIdeaState={storyIdeaDataState[0]}
		/>
	)
}
