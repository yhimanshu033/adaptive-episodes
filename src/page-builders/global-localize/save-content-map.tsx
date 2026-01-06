import { useEffect } from 'react'
import useEditorExtendedStore from '@/store/extended-store'
import { useEditorData } from 'unified-editor'

import useEpisodeId from '@/providers/episode-id-provider'

export default function SaveContentMap() {
	const { children } = useEditorData()
	const id = useEpisodeId()

	const { addExtendedContentMap } = useEditorExtendedStore()

	useEffect(() => {
		addExtendedContentMap(id, { children })
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [id, children])

	return null
}
