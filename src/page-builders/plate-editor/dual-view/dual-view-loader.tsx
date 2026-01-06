import React from 'react'

import DotLoader from '@/components/aural-ui/dot-loader'

export default function DualViewLoader() {
	return (
		<div className="sticky top-0 flex h-[calc(100svh-44px)] flex-col items-center justify-center">
			<DotLoader />
		</div>
	)
}
