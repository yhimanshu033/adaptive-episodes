import React from 'react'
import { Portal } from '@radix-ui/react-portal'

import DotLoader, { DotLoaderProps } from './aural-ui/dot-loader'
import { Overlay, OverlayProps } from './aural-ui/overlay'

export function FullScreenLoader({
	overlayProps,
	loaderProps,
}: {
	loaderProps?: DotLoaderProps
	overlayProps?: OverlayProps
}) {
	return (
		<Portal>
			<Overlay
				classes={{
					root: 'z-600',
					wrapper: 'z-700',
				}}
				noise="none"
				{...overlayProps}
			>
				<DotLoader {...loaderProps} />
			</Overlay>
		</Portal>
	)
}
