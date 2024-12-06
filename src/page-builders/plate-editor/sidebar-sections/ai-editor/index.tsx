'use client'

import React from 'react'
import { Plate } from '@udecode/plate-common/react'
import { Value } from '@udecode/slate'

import { Editor } from '@/components/plate-ui/editor'

import { useCreateEditor } from './create-editor'

export default function AiDnd({ val }: { id: string; val: string }) {
	const editor = useCreateEditor({
		value: JSON.parse(val) as Value,
		// id: id,
	})

	return (
		<Plate editor={editor}>
			<Editor />
		</Plate>
	)
}
