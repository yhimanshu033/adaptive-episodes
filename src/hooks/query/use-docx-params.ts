import { useEpisodeContentUtil } from '@/hooks/query/use-episode-content'
import { useEditorData, useEpisodeIdStore, useUnifiedEditorRef } from 'unified-editor'
import { useShallow } from 'zustand/react/shallow'

import useEpisodeTableContext from '@/providers/episode-table-provider'

import { TDocxHTMLArgs } from '@/types/plate-types'

type TUseDocxParamsRet = TDocxHTMLArgs & { projectTitle: string }

export default function useDocxParams(): TUseDocxParamsRet {
	const editor = useUnifiedEditorRef()
	const { editorText } = useEditorData()
	const words = editorText.split(/\s+/).filter(Boolean).length
	const { store: useEpisodeIdStoreContext } = useEpisodeIdStore()
	const title = useEpisodeIdStoreContext(
		useShallow((state) => state.currentTitle)
	)
	const { data } = useEpisodeContentUtil()
	const epNumber = data?.chapter.seq_number ?? 0
	const { initialStoryData } = useEpisodeTableContext()
	const projectTitle = initialStoryData?.project_title ?? ''

	return {
		epNumber,
		title,
		value: editor.children,
		words,
		projectTitle,
	}
}
