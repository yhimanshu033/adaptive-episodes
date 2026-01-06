import React from 'react'
import { COPILOT_LOGO_URL } from '@/constants/global-constants'

import { Loader } from '@/components/loader'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export default function AILoader({ isPending }: { isPending: boolean }) {
	if (!isPending) {
		return null
	}

	return (
		<div className="mb-4 flex items-center justify-start">
			<Avatar className="mr-2">
				<AvatarImage src={COPILOT_LOGO_URL} alt="AI" />
				<AvatarFallback>AI</AvatarFallback>
			</Avatar>
			<Loader />
		</div>
	)
}
