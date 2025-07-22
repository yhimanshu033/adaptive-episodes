import React from 'react'
import { AiAvatarIcon } from '@/icons/ai-avatar-icon'
import { useGlobalStore } from '@/store/global-store'

import { BodyMedium } from '@/components/aural-ui/typography'
import { getFirstName } from '@/lib/utils/helpers'

const WelcomeMessage = () => {
	const userData = useGlobalStore((state) => state.userData)
	return (
		<div className="flex h-full w-full flex-col items-center justify-center px-6 py-6 text-center">
			<AiAvatarIcon className="mb-4" />
			<BodyMedium align="center" as="h1" className="py-2">
				Welcome {getFirstName(userData?.user.fullname ?? '')},
			</BodyMedium>

			<BodyMedium color="tertiary" as="p" align="center">
				Ask me anything, or just tap one of the
				<br />
				topic to get started
			</BodyMedium>
		</div>
	)
}

export default WelcomeMessage
