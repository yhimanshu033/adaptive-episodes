import React, { useEffect, useState } from 'react'

import StreamedResponse from '@/components/ui/streamed-response'

interface OutlinerStreamedResponseProps {
	response: string
}
export default function OutlinerStreamedResponse({
	response,
}: OutlinerStreamedResponseProps) {
	const [chunks, setChunks] = useState<string[]>([])

	useEffect(() => {
		setChunks((prev) => {
			const prevFull = prev.join('')
			if (response.startsWith(prevFull)) {
				const newChunk = response.slice(prevFull.length)
				return newChunk ? [...prev, newChunk] : prev
			}
			return [response]
		})
	}, [response])

	return <StreamedResponse data={chunks} />
}
