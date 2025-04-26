import React from 'react'
import { SocketStreamingProvider } from '@/hooks/use-socket-streaming'
import VideoUpload from '@/page-builders/promos/video-upload'

export default function PromosPage() {
	const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL
	return (
		<SocketStreamingProvider baseUrl={baseUrl}>
			<VideoUpload />
		</SocketStreamingProvider>
	)
}
