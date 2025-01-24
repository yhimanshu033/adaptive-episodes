/* eslint-disable @typescript-eslint/no-misused-promises */
import React from 'react'
import useSaveEpisode from '@/hooks/use-save-episode'
import { Save } from 'lucide-react'

import { IconLoader } from '@/components/loader'
import { Button } from '@/components/ui/button'

const SaveEpisode = () => {
	const { handleSave, isSaved, readOnly, isPending } = useSaveEpisode()

	if (readOnly) return null

	return (
		<div className="flex gap-2">
			{isPending ? (
				<IconLoader />
			) : (
				<Button
					tooltip="Save Episode"
					disabled={isSaved}
					size="icon"
					onClick={() => handleSave()}
				>
					<Save size={16} />
				</Button>
			)}
		</div>
	)
}

export default SaveEpisode
