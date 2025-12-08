import React from 'react'

import { Typography } from '@/components/aural-ui/typography'

export default function OutlinerQuestionnaireHeader() {
	return (
		<section className="border-fm-divider-tertiary z-20 flex min-h-15.5 items-center justify-between gap-4 border-y py-3 pr-4 pl-7">
			<Typography variant="body-small" as="h4">
				{'Onboarding'}
			</Typography>
		</section>
	)
}
