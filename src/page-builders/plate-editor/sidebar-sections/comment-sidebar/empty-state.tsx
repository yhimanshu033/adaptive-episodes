import React from 'react'
import { MessageIcon } from '@/icons/message-icon'

import { Typography } from '@/components/aural-ui/typography'

const EmptyState = ({ description }: { description: string }) => {
	return (
		<div className="flex h-full flex-col items-center justify-center gap-6">
			<div className="bg-fm-surface-frosted/20 rounded-full p-4">
				<MessageIcon className="text-fm-icon-inactive size-5" />
			</div>
			<Typography
				as="div"
				color="tertiary"
				variant="body-medium"
				align="center"
			>
				{description}
			</Typography>
		</div>
	)
}

export default EmptyState
