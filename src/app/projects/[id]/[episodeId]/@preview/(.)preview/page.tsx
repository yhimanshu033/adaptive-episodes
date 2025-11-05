import React from 'react'
import Preview from '@/page-builders/preview'
import { Portal } from '@radix-ui/react-portal'

export default function Page() {
	return (
		<Portal className="fixed inset-0 z-50">
			<div className="animate-fm-slideInUp">
				<Preview />
			</div>
		</Portal>
	)
}
