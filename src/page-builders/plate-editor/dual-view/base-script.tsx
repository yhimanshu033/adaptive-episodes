import React from 'react'
import { BASE_SCRIPT_EDITOR_ID } from '@/constants/editor-constants'
import { useBaseData } from '@/hooks/query/use-base-content'

import ContentDisplay from './content-display'

const BaseScript = () => {
	const { data: baseContent, isLoading } = useBaseData()

	return (
		<ContentDisplay
			content={baseContent?.text}
			isLoading={isLoading}
			enableDiff={true}
			id={BASE_SCRIPT_EDITOR_ID}
		/>
	)
}

export default BaseScript
