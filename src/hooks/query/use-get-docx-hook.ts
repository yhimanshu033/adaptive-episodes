import { useMemo } from 'react'
import { GET_DOCX_HTML_QUERY_KEY } from '@/constants/query-constants'
import useDocxParams from '@/hooks/query/use-docx-params'
import useEnableDocx from '@/hooks/use-enable-docx'
import { useQuery } from '@tanstack/react-query'
import { useUnifiedEditorRef } from 'unified-editor'

import { hashString } from '@/lib/utils/helpers'
import { valueToHTML } from '@/lib/utils/plate'

export default function useDocxHtml() {
	const editor = useUnifiedEditorRef()
	const { downloadDocxEnabled } = useEnableDocx()

	const editorString = useMemo(() => {
		return JSON.stringify(editor.children)
	}, [editor.children])

	const editorStringHash = useMemo(() => {
		return hashString(editorString)
	}, [editorString])

	const props = useDocxParams()

	const query = useQuery({
		queryKey: [GET_DOCX_HTML_QUERY_KEY, editorStringHash],
		queryFn: async () => await valueToHTML(props),
		enabled: downloadDocxEnabled,
	})

	return { ...query, ...props }
}
