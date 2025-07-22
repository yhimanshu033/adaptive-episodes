import React from 'react'
import { BASE_SCRIPT_EDITOR_ID } from '@/constants/editor-constants'
import { useBaseData } from '@/hooks/query/use-base-content'
import useMyEditor from '@/hooks/use-my-editor'
import { Plate } from '@udecode/plate-common/react'

import { Editor } from '@/components/plate-ui/editor'

import DualViewLoader from './dual-view-loader'

const BaseScript: React.FC = () => {
	const { data: baseContent, isLoading } = useBaseData()

	const editor = useMyEditor({
		content: baseContent?.text || '',
		id: BASE_SCRIPT_EDITOR_ID,
		simplified: true,
	})

	if (isLoading) {
		return <DualViewLoader />
	}

	if (!baseContent || !baseContent.text) {
		return <div className="mt-28 text-center">Kein Basisskript verfügbar</div>
	}

	return (
		<Plate editor={editor}>
			<Editor
				focusRing={false}
				readOnly
				variant="ghost"
				size="md"
				className="!pt-0"
			/>
		</Plate>
	)
}

export default BaseScript
