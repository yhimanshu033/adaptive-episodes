import React, { useCallback, useMemo, useState } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import { HeadphonesIcon } from 'lucide-react'

import CircularLoader from './aural-ui/circular-loader'
import { IconButton } from './aural-ui/icon-button'

const DownloadAudio = () => {
	const { id } = useParams()
	const searchParams = useSearchParams()
	const seq = searchParams.get('seq')
	const maxAllowedSequence = 3
	const [isLoading, setIsLoading] = useState(false)

	// eslint-disable-next-line react-hooks/exhaustive-deps
	const audioURLS = [
		'https://storage.googleapis.com/prod-pocketfm-generative-ai/uploads/28_adhoc_mastering_mastered_mastered.mp328_adhoc_mastering_mastered_mastered.mp3',
		'https://storage.googleapis.com/prod-pocketfm-generative-ai/uploads/29_adhoc_mastering_mastered_mastered.mp329_adhoc_mastering_mastered_mastered.mp3',
		'https://storage.googleapis.com/prod-pocketfm-generative-ai/uploads/30_adhoc_mastering_mastered_mastered.mp330_adhoc_mastering_mastered_mastered.mp3',
	]

	const isAllowed = useMemo(() => {
		return Number(id) === 4258 && Number(seq) <= maxAllowedSequence
	}, [id, seq])

	const handleDownload = useCallback(() => {
		const downloadWithLoading = async () => {
			try {
				setIsLoading(true)
				const audioURL = audioURLS[Number(seq) - 1]

				await fetch(audioURL)
					.then((response) => {
						if (!response.ok) {
							throw new Error('Network response was not ok')
						}
						return response.blob()
					})
					.then((blob) => {
						const link = document.createElement('a')
						const objectURL = URL.createObjectURL(blob)
						link.href = objectURL
						link.download = `EP ${seq}_audio.mp3`
						document.body.appendChild(link)
						link.click()
						document.body.removeChild(link)
						URL.revokeObjectURL(objectURL)
					})
			} catch (error) {
				console.error('There was a problem with the download operation:', error)
			} finally {
				setIsLoading(false)
			}
		}

		void downloadWithLoading()
	}, [audioURLS, seq])

	if (!isAllowed) {
		return null
	}

	return (
		<IconButton
			variant="ghost"
			shape="square"
			tooltip={isLoading ? 'Downloading...' : 'Download audio'}
			icon={isLoading ? <CircularLoader /> : <HeadphonesIcon />}
			label={isLoading ? 'Downloading...' : 'Download audio'}
			size="small"
			disabled={isLoading}
			tooltipContentProps={{
				side: 'bottom',
				align: 'center',
			}}
			className="hover:text-fm-secondary-800 hover:bg-fm-secondary-50 text-fm-icon-active size-7 shrink-0"
			onClick={handleDownload}
		/>
	)
}

export default DownloadAudio
