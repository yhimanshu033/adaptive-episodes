import React from 'react'
import { ArrowRightUpIcon } from '@/icons/arrow-right-up-icon'
import usePlateStore from '@/store/plate-store'

import { Button } from '@/components/aural-ui/button'
import { Divider } from '@/components/aural-ui/divider'
import { Typography } from '@/components/aural-ui/typography'

import { ESidebar } from '@/types/plate-types'

const ReviewAdded = ({ count }: { count?: number }) => {
	const { setSidebar } = usePlateStore()
	return (
		<div className="border-fm-divider-primary/20 bg-fm-surface-secondary/30 rounded-fm-m my-2 w-full space-y-3 border p-3">
			<Typography
				variant="body-small"
				as="p"
				className="text-fm-secondary !text-fm-md"
			>
				Review done, dropped{' '}
				<span className="text-fm-primary">{count ? count : 'No'} comments</span>
			</Typography>
			{count && (
				<>
					<Divider />
					<Button
						variant="outline"
						size="sm"
						innerClassName="border-fm-divider-primary/50 h-9"
						onClick={() => setSidebar(ESidebar.COMMENTS)}
					>
						<ArrowRightUpIcon />
						<p>Checkout</p>
					</Button>
				</>
			)}
		</div>
	)
}

export default ReviewAdded
