import { useParams } from 'next/navigation'
import { BULK_EP_PROMPT_QUERY_KEY } from '@/constants/query-constants'
import { getBulkEpisodeDownloadUrls } from '@/server-action/episode-action'
import { useQuery } from '@tanstack/react-query'
import { useEditorRef } from 'platejs/react'

import { hashString } from '@/lib/utils/helpers'

import { TDownloadBulkEpisodeBodyParams } from '@/types/episode-type'

export default function useBulkEpisodeDownloadQuery(
	body: TDownloadBulkEpisodeBodyParams
) {
	const { id } = useParams()
	const editor = useEditorRef()

	const text = editor.api.string([])

	const hash = hashString(text)

	const query = useQuery({
		queryKey: [BULK_EP_PROMPT_QUERY_KEY, body.seq_nos.join(','), hash],
		queryFn: () => getBulkEpisodeDownloadUrls(String(id), body),
	})

	return { ...query, text }
}
