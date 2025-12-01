import React from 'react'
import OutlinerQuestionnaire from '@/page-builders/episodes/outliner-questionnaire'
import { OutlinerQuestionnaireContextProvider } from '@/page-builders/episodes/outliner-questionnaire/provider'

export default function Page() {
	return (
		<OutlinerQuestionnaireContextProvider>
			<OutlinerQuestionnaire />
		</OutlinerQuestionnaireContextProvider>
	)
}
