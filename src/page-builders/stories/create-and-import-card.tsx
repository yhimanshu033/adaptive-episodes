import React from 'react'
import { PlusIcon } from '@/icons/plus-icon'
import CreateAndImportDialog from '@/page-builders/stories/create-and-import'

import { IconButton } from '@/components/aural-ui/icon-button'

const CreateAndImportCard = () => {
	return (
		<CreateAndImportDialog>
			<div className="border-fm-divider-secondary hover:bg-fm-divider-primary/30 hover:border-fm-divider-primary flex h-102 w-full max-w-77 cursor-pointer items-center justify-center border-2 border-dashed">
				<IconButton
					label="Add Story"
					variant="outlined"
					icon={<PlusIcon className="size-8" />}
				/>
			</div>
		</CreateAndImportDialog>
	)
}

export default CreateAndImportCard
