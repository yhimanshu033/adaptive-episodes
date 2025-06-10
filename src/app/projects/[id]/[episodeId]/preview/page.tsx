import React from 'react'
import Preview from '@/page-builders/preview'

export default async function Page({
	params,
}: {
	params: Promise<{ episodeId: string }>
}) {
	const { episodeId } = await params

	return <Preview episodeId={Number(episodeId)} />
}
