import { BULK_EP_PROMPT_QUERY_KEY } from '@/constants/query-constants'
import useBulkEpisodeMutations from '@/hooks/mutation/use-bulk-episode-mutations'
import { useQuery } from '@tanstack/react-query'
import { useEditorRef } from 'platejs/react'

import { hashString } from '@/lib/utils/helpers'

import { TDownloadBulkEpisodeBodyParams } from '@/types/episode-type'

export default function useBulkEpisodeDownloadQuery({
	seq_nos,
}: TDownloadBulkEpisodeBodyParams) {
	const {
		getDownloadBulkUrlMutation: { mutateAsync },
	} = useBulkEpisodeMutations()
	const editor = useEditorRef()

	const text = editor.api.string([])

	const hash = hashString(text)

	const query = useQuery({
		queryKey: [BULK_EP_PROMPT_QUERY_KEY, seq_nos.join(','), hash],
		queryFn: () => mutateAsync({ seq_nos }),
	})

	return { ...query, text }
}
