import React from 'react'

import CircularLoader from '@/components/aural-ui/circular-loader'
import { Overlay } from '@/components/aural-ui/overlay'

export default function Loader({ isLoading = false }: { isLoading?: boolean }) {
	if (!isLoading) {
		return null
	}

	return (
		<Overlay glass="low" opacity="low" noise="none">
			<CircularLoader
				size="xl"
				text="Please wait..."
				classes={{
					text: 'text-fm-lg leading-fm-lg ',
				}}
			/>
		</Overlay>
	)
}
