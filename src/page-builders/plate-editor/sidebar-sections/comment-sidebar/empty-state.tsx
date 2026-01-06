import React from 'react'
import { MessageIcon } from '@/icons/message-icon'

import { Typography } from '@/components/aural-ui/typography'
import { cn } from '@/lib/aural-ui/utils'

const EmptyState = ({
	description,
	classes = {},
}: {
	classes?: {
		description?: string
		icon?: string
		iconContainer?: string
		root?: string
	}
	description: string
}) => {
	return (
		<div
			className={cn(
				'flex h-full flex-col items-center justify-center gap-6',
				classes?.root
			)}
		>
			<div
				className={cn(
					'bg-fm-surface-frosted/20 rounded-full p-4',
					classes?.iconContainer
				)}
			>
				<MessageIcon
					className={cn('text-fm-icon-inactive size-5', classes?.icon)}
				/>
			</div>
			<Typography
				as="div"
				color="tertiary"
				variant="body-medium"
				align="center"
				className={classes?.description}
			>
				{description}
			</Typography>
		</div>
	)
}

export default EmptyState
