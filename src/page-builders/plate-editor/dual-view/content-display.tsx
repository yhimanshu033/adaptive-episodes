'use client'

import React, { useCallback, useState } from 'react'
import { DUAL_VIEW_EDITOR_ID } from '@/constants/editor-constants'
import useMyEditor from '@/hooks/use-my-editor'
import DualViewLoader from '@/page-builders/plate-editor/dual-view/dual-view-loader'
import { Plate } from 'platejs/react'

import { Button } from '@/components/aural-ui/button'
import { If, IfElse } from '@/components/aural-ui/if-else'
import { Editor } from '@/components/plate-ui-v2/editor'

import DiffDisplay from './diff-display'

interface ContentDisplayProps {
	content?: string
	customButton?: React.ReactNode
	enableDiff?: boolean
	id?: string
	isLoading?: boolean
	reverseDiff?: boolean
}

export default function ContentDisplay({
	content,
	id = DUAL_VIEW_EDITOR_ID,
	isLoading,
	enableDiff,
	reverseDiff,
	customButton,
}: ContentDisplayProps) {
	const editor = useMyEditor({
		content: content ?? '',
		id,
		simplified: true,
	})
	const [showDiff, setShowDiff] = useState(false)

	const RenderedContent = () => {
		if (showDiff && enableDiff) {
			return <DiffDisplay content={content} reverse={reverseDiff} />
		}
		return (
			<Plate editor={editor}>
				<Editor
					readOnly
					variant="aural"
					className="bg-fm-surface-primary text-fm-tertiary"
				/>
			</Plate>
		)
	}

	const toggleDiff = useCallback(() => {
		setShowDiff((prev) => !prev)
	}, [])

	if (isLoading || content === undefined) {
		return <DualViewLoader />
	}

	return (
		<div className="relative">
			<If condition={enableDiff}>
				<div className="absolute top-4 z-100 flex w-full justify-end gap-2 px-6">
					{customButton}
					<Button
						tooltip="Show Diff-View"
						variant="outline"
						size="sm"
						onClick={toggleDiff}
					>
						<IfElse condition={showDiff} if="Hide DIFF" else="Show DIFF" />
					</Button>
				</div>
			</If>
			<RenderedContent />
		</div>
	)
}
