import React from 'react'
import { API_URLS } from '@/constants/global-constants'
import useDocxHtml from '@/hooks/mutation/use-get-docx-hook'
import useSocket from '@/hooks/use-socket'
import { useMutation } from '@tanstack/react-query'

import { downloadFile } from '@/lib/utils/client-helpers'

import { DownloadDocxParams, TGetDocxFromHtmlBody } from '@/types/episode-type'

export default function useDocxDownloadHook({
	latestStatus,
}: DownloadDocxParams) {
	const { mutateAsync: getDocxHtml, showButton } = useDocxHtml({ latestStatus })
	const { startTask, getResponse } = useSocket()
	const downloadedContentRef = React.useRef<string | null>(null)

	async function downloadDocx() {
		const { base64String, html, title } = await getDocxHtml()
		const taskId = await startTask<TGetDocxFromHtmlBody>({
			method: 'POST',
			url: API_URLS.STREAM_DOCX,
			body: {
				html_content: base64String,
			},
			noCache: downloadedContentRef.current === html,
		})
		downloadedContentRef.current = html
		const responseUrl = await getResponse(taskId)
		downloadFile(responseUrl as string, `${title}.docx`)
	}

	const mutation = useMutation({
		mutationKey: ['download-docx'],
		mutationFn: downloadDocx,
	})

	return { showButton, ...mutation }
}
