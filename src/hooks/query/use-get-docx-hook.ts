import { useMemo } from 'react'
import { GET_DOCX_HTML_QUERY_KEY } from '@/constants/query-constants'
import useDocxParams from '@/hooks/query/use-docx-params'
import useEpisodeIdStore from '@/store/episode-id-store'
import { useQuery } from '@tanstack/react-query'
import { useEditorRef } from 'platejs/react'
import { useShallow } from 'zustand/react/shallow'

import { hashString } from '@/lib/utils/helpers'
import { valueToHTML } from '@/lib/utils/plate'

import { EStatus } from '@/types/common'
import { DownloadDocxParams } from '@/types/episode-type'

export default function useDocxHtml({ latestStatus }: DownloadDocxParams) {
	const editor = useEditorRef()
	const { store: useEpisodeIdStoreContext } = useEpisodeIdStore()
	const selectedStatus = useEpisodeIdStoreContext(
		useShallow((state) => state.selectedStatus)
	)

	const editorString = useMemo(() => {
		return JSON.stringify(editor.children)
	}, [editor.children])

	const editorStringHash = useMemo(() => {
		return hashString(editorString)
	}, [editorString])

	const props = useDocxParams()

	const showButton =
		selectedStatus === EStatus.PUBLISHED || latestStatus === EStatus.PUBLISHED

	const query = useQuery({
		queryKey: [GET_DOCX_HTML_QUERY_KEY, editorStringHash],
		queryFn: async () => await valueToHTML(props),
		enabled: showButton,
	})

	return { showButton, ...query, ...props }
}
