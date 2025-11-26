import React from 'react'

import DotLoader from '@/components/aural-ui/dot-loader'

export default function OutlinerLoading() {
	return (
		<div className="flex h-full min-h-[70vh] flex-col justify-center">
			<DotLoader />
		</div>
	)
}
