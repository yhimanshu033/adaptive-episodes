import React, { useCallback } from 'react'
import { API_URLS } from '@/constants/global-constants'
import useDocxHtml from '@/hooks/query/use-get-docx-hook'
import useIsGerman from '@/hooks/use-is-german'
import useSocket from '@/hooks/use-socket'
import { useMutation, useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'

import { downloadFile } from '@/lib/utils/client-helpers'
import { getFormattedDate } from '@/lib/utils/helpers'

import { DownloadDocxParams, TGetDocxFromHtmlBody } from '@/types/episode-type'

// Common utility function to format file size
function formatFileSize(sizeInBytes: number): string {
	if (sizeInBytes < 1024) {
		return `${sizeInBytes.toFixed(0)} B`
	} else if (sizeInBytes < 1024 * 1024) {
		const sizeInKB = sizeInBytes / 1024
		return `${sizeInKB.toFixed(2)} KB`
	} else if (sizeInBytes < 1024 * 1024 * 1024) {
		const sizeInMB = sizeInBytes / (1024 * 1024)
		return `${sizeInMB.toFixed(2)} MB`
	} else {
		const sizeInGB = sizeInBytes / (1024 * 1024 * 1024)
		return `${sizeInGB.toFixed(2)} GB`
	}
}

// Helper function to calculate file size from base64 string
function calculateFileSizeFromBase64(base64String: string): string {
	const sizeInBytes = (base64String.length * 3) / 4
	return formatFileSize(sizeInBytes)
}

// Helper function to get actual file size from URL with base64 fallback
async function getFileSizeFromURL(
	url: string,
	base64String: string
): Promise<string> {
	try {
		const response = await fetch(url, { method: 'HEAD' })
		const contentLength = response.headers.get('content-length')
		if (contentLength) {
			const sizeInBytes = parseInt(contentLength, 10)
			return formatFileSize(sizeInBytes)
		}
	} catch (error) {
		console.error(
			'Error getting file size from URL, falling back to base64 calculation:',
			error
		)
		// Fallback to base64 calculation
		return calculateFileSizeFromBase64(base64String)
	}

	// Fallback if no content-length header
	return calculateFileSizeFromBase64(base64String)
}

export default function useDocxDownloadHook({
	latestStatus,
}: DownloadDocxParams) {
	const { data, showButton, projectTitle, epNumber, title } = useDocxHtml({
		latestStatus,
	})

	const { startTask, getResponse } = useSocket()
	const downloadedContentRef = React.useRef<string | null>(null)
	const cachedDocxUrlRef = React.useRef<string | null>(null)

	const isGerman = useIsGerman()

	// Common function to generate DOCX and return URL
	const generateDocxUrl = useCallback(
		async (useCache: boolean = false): Promise<string | undefined> => {
			if (!data) {
				toast.error("Couldn't generate Docx")
				return
			}
			const { base64String, html } = data

			const taskId = await startTask<TGetDocxFromHtmlBody>({
				method: 'POST',
				url: API_URLS.STREAM_DOCX,
				body: {
					html_content: base64String,
				},
				noCache: useCache ? downloadedContentRef.current === html : false,
			})

			if (useCache) {
				downloadedContentRef.current = html
			}

			// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
			const responseUrl = (await getResponse(taskId)) as string

			// Cache the URL for potential reuse
			if (!useCache) {
				cachedDocxUrlRef.current = responseUrl
			}

			return responseUrl
		},
		[data, getResponse, startTask]
	)

	// Query to get actual DOCX file size
	const { data: fileSize } = useQuery({
		queryKey: ['docx-actual-file-size', latestStatus, title],
		queryFn: async () => {
			const base64String = data?.base64String
			const responseUrl = await generateDocxUrl()
			if (!responseUrl || !base64String) {
				toast.error("Couldn't calculate file size!")
				return
			}
			return await getFileSizeFromURL(responseUrl, base64String)
		},
		enabled: showButton && !!data?.base64String,
		staleTime: 5 * 60 * 1000, // 5 minutes
		retry: 1,
	})

	async function downloadDocx() {
		// Use cached URL if available, otherwise generate new one
		const responseUrl =
			cachedDocxUrlRef.current || (await generateDocxUrl(true))
		if (!responseUrl) {
			toast.error("Couldn't download docx!")
			return
		}
		downloadFile(
			responseUrl,
			`${projectTitle} - Ep ${epNumber} - ${title} - ${getFormattedDate()}.docx`
		)
	}

	const mutation = useMutation({
		mutationKey: ['download-docx'],
		mutationFn: downloadDocx,
	})

	return {
		showButton: showButton || !isGerman,
		title,
		projectTitle,
		epNumber,
		fileSize,
		isEnabled: !!data?.base64String,
		...mutation,
	}
}
