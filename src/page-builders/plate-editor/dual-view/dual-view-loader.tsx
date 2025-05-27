import React from 'react'

import { Loader } from '@/components/loader'

export default function DualViewLoader() {
	return (
		<div className="sticky top-0 flex h-[calc(100svh-44px)] flex-col items-center justify-center">
			<Loader />
		</div>
	)
}
