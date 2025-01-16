'use client'

import React from 'react'
import { useCreateEditor } from '@/page-builders/plate-editor/sidebar-sections/ai-editor/create-editor'
import { Plate } from '@udecode/plate-common/react'
import { Value } from '@udecode/slate'

import { Editor } from '@/components/plate-ui/editor'

export default function AiDnd({ val }: { id: string; val: string }) {
	const editor = useCreateEditor({
		value: JSON.parse(val) as Value,
	})
	const ref = React.useRef<HTMLDivElement>(null)

	return (
		<Plate editor={editor}>
			<Editor ref={ref} isAi />
		</Plate>
	)
}
