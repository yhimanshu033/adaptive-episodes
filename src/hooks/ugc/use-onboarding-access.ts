import useUserAccess from '@/hooks/query/use-user-access'

export default function useOnboardingAccess() {
	const { data: accessData } = useUserAccess()

	return !!accessData?.survey_onboarding
}
