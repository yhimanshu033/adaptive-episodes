import React from 'react'

import DotLoader from '@/components/aural-ui/dot-loader'

export default function Loading() {
	return (
		<div className="fixed inset-0 z-50 flex min-h-dvh items-center justify-center bg-black">
			<DotLoader />
		</div>
	)
}
