import React from 'react'
import OutlinerQuestionnaire from '@/page-builders/episodes/outliner-questionnaire'
import OnboardingAccessControl from '@/page-builders/episodes/outliner-questionnaire/onboarding-access-control'
import { OutlinerQuestionnaireContextProvider } from '@/page-builders/episodes/outliner-questionnaire/provider'

export default function Page() {
	return (
		<OnboardingAccessControl>
			<OutlinerQuestionnaireContextProvider>
				<OutlinerQuestionnaire />
			</OutlinerQuestionnaireContextProvider>
		</OnboardingAccessControl>
	)
}
