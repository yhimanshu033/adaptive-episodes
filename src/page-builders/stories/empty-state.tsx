import React from 'react'
import Image from 'next/image'
import { PlusIcon } from '@/icons/plus-icon'
import CreateAndImportDialog from '@/page-builders/stories/create-and-import-dialog'

import { Button } from '@/components/aural-ui/button'

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
			<CreateAndImportDialog>
				<Button icon="left" iconLeft={<PlusIcon height={20} width={20} />}>
					Create Series
				</Button>
			</CreateAndImportDialog>
			<div className="text-fm-tertiary text-center">
				<p>{'It’s a clean slate, for now! Create series and'}</p>
				<p>they will appear here.</p>
			</div>
		</div>
	)
}

export default EmptyState
