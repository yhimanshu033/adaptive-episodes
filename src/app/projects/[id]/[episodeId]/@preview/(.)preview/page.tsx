import React from 'react'
import Preview from '@/page-builders/preview'
import { Portal } from '@radix-ui/react-portal'

export default async function Page({
	params,
}: {
	params: Promise<{ episodeId: string }>
}) {
	const { episodeId } = await params

	return (
		<Portal className="fixed inset-0 z-50">
			<div className="animate-fm-slideInUp">
				<Preview episodeId={Number(episodeId)} />
			</div>
		</Portal>
	)
}
