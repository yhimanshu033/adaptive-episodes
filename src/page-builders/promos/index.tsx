import React from 'react'
import { SocketProvider } from '@/hooks/use-socket'
import VideoUpload from '@/page-builders/promos/video-upload'

export default function PromosPage() {
	const baseUrl = process.env.NEXT_PUBLIC_PROMOS_BACKEND_URL
	return (
		<SocketProvider baseUrl={baseUrl}>
			<VideoUpload />
		</SocketProvider>
	)
}
