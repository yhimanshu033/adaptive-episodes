import React from 'react'
import OnboardingAccessControl from '@/page-builders/episodes/outliner-questionnaire/onboarding-access-control'
import ProjectCreate from '@/page-builders/project-create'

export default function Page() {
	return (
		<OnboardingAccessControl>
			<ProjectCreate />
		</OnboardingAccessControl>
	)
}
