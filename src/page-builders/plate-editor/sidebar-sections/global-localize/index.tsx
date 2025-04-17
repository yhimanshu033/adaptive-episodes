import React, { useMemo } from 'react'
import useEditorExtendedStore from '@/store/extended-store'

import { getText } from '@/lib/utils/plate'

export default function GlobalLocalize() {
	const { store: useExtendedStore } = useEditorExtendedStore()
	const contentMap = useExtendedStore((state) => state.episodeContentMap)

	const contentText = useMemo(
		() =>
			Object.keys(contentMap).reduce(
				(acc, key) => acc + getText(contentMap[Number(key)].children),
				''
			),
		[contentMap]
	)

	console.log({ contentText })
	return <div className="w-fit"></div>
}
