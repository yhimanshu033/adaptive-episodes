import { GET_DOCX_ESTIMATE_QUERY_KEY } from '@/constants/query-constants'
import useEditorData from '@/hooks/plate/use-editor-data'
import { useQuery } from '@tanstack/react-query'

import { estimateDocxSizeWithOverhead } from '@/lib/utils/helpers'

export default function useDocxSize() {
	const { editorText } = useEditorData()

	const query = useQuery({
		queryKey: [GET_DOCX_ESTIMATE_QUERY_KEY, editorText.length],
		queryFn: () => {
			return estimateDocxSizeWithOverhead(editorText)
		},
	})

	return query
}
