import { useEffect } from 'react'
import { useEditorData } from 'unified-editor'
import useGlobalFindAndReplace from '@/hooks/use-global-find-and-replace'
import useEditorExtendedStore from '@/store/extended-store'
import { isEqual } from 'lodash'
import { useEditorPlugin, useEditorRef } from 'platejs/react'

import useEpisodeId from '@/providers/episode-id-provider'
import {
	FindReplaceConfig,
	FindReplacePlugin,
} from '@/lib/plate/plugins/find-replace'

export default function FarConnection() {
	const episodeId = useEpisodeId()
	const { children } = useEditorData()
	const { addExtendedContentMap } = useEditorExtendedStore()
	const { options, replacedContentMap, setReplacedContentMap } =
		useGlobalFindAndReplace()
	const editor = useEditorRef()

	const { setOptions, getOptions } = useEditorPlugin(FindReplacePlugin)

	// const { currentId, ...options } = allOptions

	useEffect(() => {
		addExtendedContentMap(episodeId, { children })
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [children, episodeId])

	useEffect(() => {
		const current = getOptions()

		const { currentId: globalCurrentId, ...globalCurrent } = options
		const newOptions: FindReplaceConfig['options'] = {
			...globalCurrent,
		}

		const globalEpisodeId = globalCurrentId?.[0]
		const globalFARId = globalCurrentId?.slice(1)

		if (
			!globalEpisodeId ||
			!globalFARId ||
			globalFARId?.length < 3 ||
			!isEqual(episodeId, globalEpisodeId)
		) {
			newOptions['currentId'] = []
		} else {
			newOptions['currentId'] = globalFARId
		}

		if (isEqual(newOptions, current)) {
			return
		}

		setOptions(newOptions)

		const updatedChildren = structuredClone(children)
		editor.tf.setValue(updatedChildren)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [options, setOptions, episodeId])

	useEffect(() => {
		if (!replacedContentMap[episodeId]) {
			return
		}
		editor.tf.setValue(replacedContentMap[episodeId].children)
		setReplacedContentMap((prev) => {
			const updated = { ...prev }
			delete updated[episodeId]
			return updated
		})
	}, [replacedContentMap, episodeId, editor.tf, setReplacedContentMap])
	return null
}
