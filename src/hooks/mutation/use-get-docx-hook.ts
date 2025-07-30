import { useMemo } from 'react'
import { GET_DOCX_HTML_QUERY_KEY } from '@/constants/query-constants'
import useEditorData from '@/hooks/plate/use-editor-data'
import { useEpisodeContentUtil } from '@/hooks/query/use-episode-content'
import useEpisodeIdStore from '@/store/episode-id-store'
import { useQuery } from '@tanstack/react-query'
import { createSlateEditor, serializeHtml } from 'platejs'
import { useEditorRef } from 'platejs/react'
import { useShallow } from 'zustand/react/shallow'

import { BaseEditorKit } from '@/components/editor/editor-base-kit'
import { DEFAULT_COLOR } from '@/components/plate-ui/color-constants'
import { EditorStatic } from '@/components/plate-ui/editor-static'
import useEpisodeTableContext from '@/providers/episode-table-provider'

import { EStatus } from '@/types/common'
import { DownloadDocxParams } from '@/types/episode-type'

const siteUrl = 'https://platejs.org'

export default function useDocxHtml({ latestStatus }: DownloadDocxParams) {
	const editor = useEditorRef()
	const { editorText } = useEditorData()
	const words = editorText.split(/\s+/).filter(Boolean).length
	const { store: useEpisodeIdStoreContext } = useEpisodeIdStore()
	const title = useEpisodeIdStoreContext(
		useShallow((state) => state.currentTitle)
	)
	const { data } = useEpisodeContentUtil()
	const epNumber = data?.chapter.seq_number || 0
	const { initialStoryData } = useEpisodeTableContext()
	const projectTitle = initialStoryData?.project_title || ''
	const selectedStatus = useEpisodeIdStoreContext(
		useShallow((state) => state.selectedStatus)
	)

	const editorString = useMemo(() => {
		return JSON.stringify(editor.children)
	}, [editor.children])

	async function downloadDocx() {
		const editorStatic = createSlateEditor({
			plugins: BaseEditorKit,
			value: editor.children,
		})

		const editorHtml = await serializeHtml(editorStatic, {
			editorComponent: EditorStatic,
			props: { style: { padding: '0 calc(50% - 350px)', paddingBottom: '' } },
		})

		const prismCss = `<link rel="stylesheet" href="${siteUrl}/prism.css">`
		const tailwindCss = `<link rel="stylesheet" href="${siteUrl}/tailwind.css">`
		const katexCss = `<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.18/dist/katex.css" integrity="sha384-9PvLvaiSKCPkFKB1ZsEoTjgnJn+O3KvEwtsz37/XrkYft3DTk2gHdYvd9oWgW3tV" crossorigin="anonymous">`

		const html = `<!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <meta name="color-scheme" content="light dark" />
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
            <link
              href="https://fonts.googleapis.com/css2?family=Inter:wght@400..700&family=JetBrains+Mono:wght@400..700&display=swap"
              rel="stylesheet"
            />
            ${tailwindCss}
            ${prismCss}
            ${katexCss}
			<title>${title}</title>
            <style>
              :root {
                --font-sans: 'Inter', 'Inter Fallback';
                --font-mono: 'JetBrains Mono', 'JetBrains Mono Fallback';
              }
            </style>
          </head>
          <body>
		  <div><strong>EP ${epNumber} - ${title}</strong></div><br><br>
		  <div> Word Count: ${words} </div><br><br>
          ${editorHtml.replace(/<\/div>/g, '</div><br>').replace(/rgba\([\d\s,.]*\)/g, DEFAULT_COLOR)}
          </body>
        </html>`

		const base64String = btoa(unescape(encodeURIComponent(html)))
		return { base64String, html, title }
	}

	const showButton =
		selectedStatus === EStatus.PUBLISHED || latestStatus === EStatus.PUBLISHED

	const mutation = useQuery({
		queryKey: [GET_DOCX_HTML_QUERY_KEY, editorString],
		queryFn: downloadDocx,
		enabled: showButton,
	})

	return { showButton, ...mutation, epNumber, projectTitle, title }
}
