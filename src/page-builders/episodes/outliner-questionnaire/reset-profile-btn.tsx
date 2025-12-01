import React, { useCallback } from 'react'
import { ACTION, EVENT_TYPE, SCREEN_NAME } from '@/constants/analytics'
import useProfileReset from '@/page-builders/episodes/outliner-questionnaire/lib/hooks/use-profile-reset'
import { Eraser } from 'lucide-react'

import { Button, ButtonProps } from '@/components/aural-ui/button'
import CircularLoader from '@/components/aural-ui/circular-loader'
import { IconButton, IconButtonProps } from '@/components/aural-ui/icon-button'
import { track } from '@/lib/utils/analytics'

type ResetProfileBtn = Omit<ButtonProps, 'children'> & {
	children?: React.ReactNode
	icon?: boolean
	iconBtnProps?: IconButtonProps
	onComplete?: () => void
}
export default function ResetProfileBtn({
	onComplete = () => {
		window.location.reload()
	},
	leftIcon = <Eraser />,
	iconBtnProps,
	icon,
	...props
}: ResetProfileBtn) {
	const { mutateAsync: resetProfile, isPending: isProfileResetting } =
		useProfileReset()

	const handleResetProfile = useCallback(async () => {
		if (isProfileResetting) {
			return
		}
		await resetProfile()

		// Track profile reset
		track({
			event: EVENT_TYPE.BUTTON_CLICK,
			screenName: SCREEN_NAME.PROJECTS,
			metaData: {
				action: ACTION.OUTLINER_ONBOARDING_PROFILE_RESET,
			},
		})

		onComplete()
	}, [isProfileResetting, resetProfile, onComplete])

	if (icon) {
		return (
			<IconButton
				tooltip="Reset Profile"
				label="Reset Profile"
				onClick={() => void handleResetProfile()}
				disabled={isProfileResetting}
				icon={isProfileResetting ? <CircularLoader /> : leftIcon}
				variant="outlined"
				size="small"
				{...iconBtnProps}
			/>
		)
	}

	return (
		<Button
			tooltip="Reset Profile"
			onClick={() => void handleResetProfile()}
			disabled={isProfileResetting}
			isDisabled={isProfileResetting}
			leftIcon={isProfileResetting ? <CircularLoader /> : leftIcon}
			variant="outline"
			size="sm"
			{...props}
		>
			{props.children || 'Reset Profile'}
		</Button>
	)
}
