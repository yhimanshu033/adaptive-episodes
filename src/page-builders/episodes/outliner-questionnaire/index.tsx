'use client'

import React, { useEffect } from 'react'
import OutlinerQuestionnaireChat from '@/page-builders/episodes/outliner-questionnaire/chat'
import OutlinerQuestionnaireCompleted from '@/page-builders/episodes/outliner-questionnaire/completed'
import { useOutlinerQuestionnaireStatus } from '@/page-builders/episodes/outliner-questionnaire/lib/hooks/use-outliner-questionnaire-status'
import { EOutlinerQuestionnaireTab } from '@/page-builders/episodes/outliner-questionnaire/lib/types'
import OutlinerLoading from '@/page-builders/episodes/outliner-questionnaire/loading'
import useOutlinerQuestionnaire from '@/page-builders/episodes/outliner-questionnaire/provider'
import OutlinerQuestionnaireStartSection from '@/page-builders/episodes/outliner-questionnaire/start-section'
import OutlinerQuestionnaireStoryIdea from '@/page-builders/episodes/outliner-questionnaire/story-idea'
import OutlinerQuestionnaireSurvey from '@/page-builders/episodes/outliner-questionnaire/survey'
import OutlinerQuestionnaireWriterProfile from '@/page-builders/episodes/outliner-questionnaire/writer-profile'

import { Else, If, IfElse } from '@/components/aural-ui/if-else'

const tabToComponent: Record<EOutlinerQuestionnaireTab, React.ReactNode> = {
	[EOutlinerQuestionnaireTab.CHAT]: <OutlinerQuestionnaireChat />,
	[EOutlinerQuestionnaireTab.START]: <OutlinerQuestionnaireStartSection />,
	[EOutlinerQuestionnaireTab.SURVEY]: <OutlinerQuestionnaireSurvey />,
	[EOutlinerQuestionnaireTab.STORY_IDEA]: <OutlinerQuestionnaireStoryIdea />,
	[EOutlinerQuestionnaireTab.WRITER_PROFILE]: (
		<OutlinerQuestionnaireWriterProfile />
	),
	[EOutlinerQuestionnaireTab.COMPLETED]: <OutlinerQuestionnaireCompleted />,
}

export default function OutlinerQuestionnaire() {
	const {
		outlinerQuestionnaireTab,
		handleInitialStatusFetch,
		handleInitialConversationFetch,
	} = useOutlinerQuestionnaire()

	const { data, isPending } = useOutlinerQuestionnaireStatus()

	useEffect(() => {
		if (!data?.result?.stage || !tabToComponent[data.result.stage]) {
			return
		}
		handleInitialStatusFetch(data.result.stage)
		handleInitialConversationFetch(data)
	}, [data, handleInitialStatusFetch, handleInitialConversationFetch])

	return (
		<div className="container mx-auto grid h-full max-h-[calc(100dvh-120px)] flex-1 pt-6">
			<IfElse condition={isPending}>
				<If>
					<OutlinerLoading />
				</If>
				<Else>{tabToComponent[outlinerQuestionnaireTab]}</Else>
			</IfElse>
		</div>
	)
}
