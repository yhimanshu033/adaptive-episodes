import React from 'react'
import useSaveEpisode from '@/hooks/use-save-episode'
import { LoaderCircle, Save } from 'lucide-react'

import { Button, buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const SaveEpisode = () => {
	const { handleSave, isSaved, readOnly, isPending } = useSaveEpisode()

	if (readOnly) return null

	return (
		<div className="flex gap-2">
			{isPending ? (
				<div className={cn(buttonVariants({ variant: 'ghost', size: 'icon' }))}>
					<LoaderCircle className="animate-spin" size={16} />
				</div>
			) : (
				<Button
					tooltip="Save Episode"
					disabled={isSaved}
					size="icon"
					onClick={handleSave}
				>
					<Save size={16} />
				</Button>
			)}
		</div>
	)
}

export default SaveEpisode
