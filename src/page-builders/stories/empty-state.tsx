import React from 'react'
import Image from 'next/image'
import { PlusIcon } from '@/icons/plus-icon'
import CreateAndImport from '@/page-builders/stories/create-and-import'

import { Button } from '@/components/aural-ui/button'
import { Typography } from '@/components/aural-ui/typography'

const EmptyState = () => {
	return (
		<div className="container flex grow flex-col items-center justify-center gap-6">
			<Image
				src="/assets/empty-projects-bg_img.webp"
				alt="Background Image"
				fill
				priority
				className="z-[-1] object-cover"
			/>
			<CreateAndImport>
				<Button className="h-11" leftIcon={<PlusIcon height={20} width={20} />}>
					Create Series
				</Button>
			</CreateAndImport>
			<div>
				<Typography color="tertiary" align="center" variant="body-large">
					It’s a clean slate, for now! Create series and
				</Typography>
				<Typography color="tertiary" align="center" variant="body-large">
					they will appear here.
				</Typography>
			</div>
		</div>
	)
}

export default EmptyState
