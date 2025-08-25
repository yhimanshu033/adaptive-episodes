import React, { useMemo } from 'react'
import useDocxDownloadHook from '@/hooks/mutation/use-docx-download-hook'

import { If } from '@/components/aural-ui/if-else'

import { Button } from '../aural-ui/button'
import CircularLoader from '../ui/circular-loader'

export default function DownloadDocxButton() {
	const { isPending, showButton, mutate, isEnabled } = useDocxDownloadHook()

	const isDisabled = useMemo(() => {
		return isPending || !isEnabled
	}, [isEnabled, isPending])

	if (!showButton) {
		return null
	}

	return (
		<Button
			variant="outline"
			disabled={isDisabled}
			tooltip="Download"
			tooltipContentProps={{
				side: 'bottom',
				align: 'end',
			}}
			isDisabled={isDisabled}
			size="sm"
			className="group"
			innerClassName="font-fm-brand border-fm-divider-secondary group-hover:border-fm-divider-contrast group-disabled:translate-y-0 group-disabled:hover:border-fm-divider-secondary "
			onClick={() => mutate()}
		>
			<If condition={isDisabled}>
				<CircularLoader className="size-4" />
			</If>
			Download
		</Button>
	)
}
