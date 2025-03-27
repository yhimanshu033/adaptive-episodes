import { useEpisodeContentUtil } from '@/hooks/query/use-episode-content'
import useEpisodeIdStore from '@/store/episode-id-store'
import { useMutation } from '@tanstack/react-query'
import { withProps } from '@udecode/cn'
import {
	BaseParagraphPlugin,
	createSlateEditor,
	serializeHtml,
	SlateLeaf,
} from '@udecode/plate'
import { BaseAlignPlugin } from '@udecode/plate-alignment'
import {
	BaseBoldPlugin,
	BaseCodePlugin,
	BaseItalicPlugin,
	BaseStrikethroughPlugin,
	BaseSubscriptPlugin,
	BaseSuperscriptPlugin,
	BaseUnderlinePlugin,
} from '@udecode/plate-basic-marks'
import { BaseBlockquotePlugin } from '@udecode/plate-block-quote'
import { BaseCodeBlockPlugin } from '@udecode/plate-code-block'
import { BaseCommentsPlugin } from '@udecode/plate-comments'
import { useEditorState } from '@udecode/plate-common/react'
import { BaseDatePlugin } from '@udecode/plate-date'
import {
	BaseFontBackgroundColorPlugin,
	BaseFontColorPlugin,
	BaseFontSizePlugin,
} from '@udecode/plate-font'
import {
	BaseHeadingPlugin,
	BaseTocPlugin,
	HEADING_KEYS,
	HEADING_LEVELS,
} from '@udecode/plate-heading'
import { BaseHighlightPlugin } from '@udecode/plate-highlight'
import { BaseHorizontalRulePlugin } from '@udecode/plate-horizontal-rule'
import { BaseIndentPlugin } from '@udecode/plate-indent'
import { BaseIndentListPlugin } from '@udecode/plate-indent-list'
import { BaseKbdPlugin } from '@udecode/plate-kbd'
import { BaseColumnItemPlugin, BaseColumnPlugin } from '@udecode/plate-layout'
import { BaseLineHeightPlugin } from '@udecode/plate-line-height'
import { BaseLinkPlugin } from '@udecode/plate-link'
import { useShallow } from 'zustand/react/shallow'

import { BlockquoteElementStatic } from '@/components/plate-ui/block-quote-element-static'
import { DEFAULT_COLOR } from '@/components/plate-ui/color-constants'
import { CommentLeafStatic } from '@/components/plate-ui/comment-leaf-static'
import { EditorStatic } from '@/components/plate-ui/editor-static'
import { HeadingElementStatic } from '@/components/plate-ui/heading-element-static'
import { HighlightLeafStatic } from '@/components/plate-ui/highlight-leaf-static'
import { HrElementStatic } from '@/components/plate-ui/hr-element-static'
import { KbdLeafStatic } from '@/components/plate-ui/kbd-leaf-static'
import { ParagraphElementStatic } from '@/components/plate-ui/paragraph-element-static'
import useEpisodeTableContext from '@/providers/episode-table-provider'
import { getWordCount } from '@/lib/utils/plate'

import { EStatus } from '@/types/common'
import { DownloadDocxParams } from '@/types/episode-type'

const siteUrl = 'https://platejs.org'

export default function useDocxHtml({ latestStatus }: DownloadDocxParams) {
	const editor = useEditorState()
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
	async function downloadDocx() {
		const components = {
			[BaseBlockquotePlugin.key]: BlockquoteElementStatic,
			[BaseBoldPlugin.key]: withProps(SlateLeaf, { as: 'strong' }),
			[BaseCommentsPlugin.key]: CommentLeafStatic,
			[BaseHighlightPlugin.key]: HighlightLeafStatic,
			[BaseHorizontalRulePlugin.key]: HrElementStatic,
			[BaseItalicPlugin.key]: withProps(SlateLeaf, { as: 'em' }),
			[BaseKbdPlugin.key]: KbdLeafStatic,
			[BaseParagraphPlugin.key]: ParagraphElementStatic,
			[BaseStrikethroughPlugin.key]: withProps(SlateLeaf, { as: 'del' }),
			[BaseSubscriptPlugin.key]: withProps(SlateLeaf, { as: 'sub' }),
			[BaseSuperscriptPlugin.key]: withProps(SlateLeaf, { as: 'sup' }),
			[BaseUnderlinePlugin.key]: withProps(SlateLeaf, { as: 'u' }),
			[HEADING_KEYS.h1]: withProps(HeadingElementStatic, { variant: 'h1' }),
			[HEADING_KEYS.h2]: withProps(HeadingElementStatic, { variant: 'h2' }),
			[HEADING_KEYS.h3]: withProps(HeadingElementStatic, { variant: 'h3' }),
			[HEADING_KEYS.h4]: withProps(HeadingElementStatic, { variant: 'h4' }),
			[HEADING_KEYS.h5]: withProps(HeadingElementStatic, { variant: 'h5' }),
			[HEADING_KEYS.h6]: withProps(HeadingElementStatic, { variant: 'h6' }),
		}

		const editorStatic = createSlateEditor({
			plugins: [
				BaseColumnPlugin,
				BaseColumnItemPlugin,
				BaseTocPlugin,
				BaseParagraphPlugin,
				BaseHeadingPlugin,
				BaseBoldPlugin,
				BaseCodePlugin,
				BaseItalicPlugin,
				BaseStrikethroughPlugin,
				BaseSubscriptPlugin,
				BaseSuperscriptPlugin,
				BaseUnderlinePlugin,
				BaseBlockquotePlugin,
				BaseDatePlugin,
				BaseIndentPlugin.extend({
					inject: {
						targetPlugins: [
							BaseParagraphPlugin.key,
							BaseBlockquotePlugin.key,
							BaseCodeBlockPlugin.key,
						],
					},
				}),
				BaseIndentListPlugin.extend({
					inject: {
						targetPlugins: [
							BaseParagraphPlugin.key,
							...HEADING_LEVELS,
							BaseBlockquotePlugin.key,
							BaseCodeBlockPlugin.key,
						],
					},
				}),
				BaseLinkPlugin,
				BaseHorizontalRulePlugin,
				BaseFontColorPlugin,
				BaseFontBackgroundColorPlugin,
				BaseFontSizePlugin,
				BaseKbdPlugin,
				BaseAlignPlugin.extend({
					inject: {
						targetPlugins: [BaseParagraphPlugin.key, ...HEADING_LEVELS],
					},
				}),
				BaseLineHeightPlugin,
				BaseHighlightPlugin,
				BaseCommentsPlugin,
			],
			value: editor.children,
		})

		const editorHtml = await serializeHtml(editorStatic, {
			components,
			editorComponent: EditorStatic,
			props: {
				style: {
					padding: '0 calc(50% - 350px)',
				},
			},
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
		  <div> Neueste Wortanzahl: ${getWordCount(editor.children)} </div><br><br>
          ${editorHtml.replace(/<\/div>/g, '</div><br>').replace(/rgba\([\d\s,.]*\)/g, DEFAULT_COLOR)}
          </body>
        </html>`

		const base64String = btoa(unescape(encodeURIComponent(html)))
		return { base64String, html, title }
	}

	const mutation = useMutation({
		mutationKey: ['get-docx-html'],
		mutationFn: downloadDocx,
	})

	const showButton =
		selectedStatus === EStatus.PUBLISHED || latestStatus === EStatus.PUBLISHED

	return { showButton, ...mutation, epNumber, projectTitle }
}
