import React from 'react'
import { EditBigIcon } from '@/icons/edit-big-icon'

import { Button } from '@/components/aural-ui/button'
import CircularLoader from '@/components/aural-ui/circular-loader'
import { IconButton } from '@/components/aural-ui/icon-button'
import { Else, If, IfElse } from '@/components/aural-ui/if-else'
import { Typography } from '@/components/aural-ui/typography'

const AdaptationStatus = ({
	step,
	onClick,
}: {
	onClick: () => void
	step: number
}) => {
	return (
		<div className="bg-fm-surface-frosted/30 border-fm-divider-primary fixed right-12 bottom-20 flex h-14 items-center justify-center gap-12 rounded-full border p-4">
			<IfElse condition={step === 3}>
				<If>
					<div className="flex items-center justify-center gap-3">
						<IconButton
							label="Open Adaptation Modal"
							onClick={onClick}
							variant="ghost"
							className="hover:bg-transparent"
							icon={<EditBigIcon className="text-fm-secondary-800 size-8" />}
						/>

						<Typography>Edit adapted information</Typography>
					</div>
					<Button
						onClick={onClick}
						variant="text"
						className="uppercase"
						innerClassName="!py-0 !pr-2 h-fit translate-y-0"
					>
						Edit details
					</Button>
				</If>
				<Else>
					<div className="flex items-center justify-center gap-3">
						<CircularLoader className="size-8" />
						<div className="animate-gradient-slide bg-clip-text text-transparent">
							Adaptation in progress....
						</div>
					</div>
					<Button
						onClick={onClick}
						variant="text"
						className="uppercase"
						innerClassName="!p-0 h-fit translate-y-0"
					>
						Expand
					</Button>
				</Else>
			</IfElse>
		</div>
	)
}

export default AdaptationStatus
