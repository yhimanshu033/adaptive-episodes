'use client'

import React, { useCallback, useMemo, useState } from 'react'
import { DUAL_VIEW_EDITOR_ID } from '@/constants/editor-constants'
import useFileContent from '@/hooks/query/use-file-content'
import useMyEditor from '@/hooks/use-my-editor'
import DualViewLoader from '@/page-builders/plate-editor/dual-view/dual-view-loader'
import { Plate } from 'platejs/react'
import { toast } from 'sonner'

import { Button } from '@/components/aural-ui/button'
import { Else, If, IfElse } from '@/components/aural-ui/if-else'
import { Editor } from '@/components/plate-ui-v2/editor'
import { getTextFromTextOrValue } from '@/lib/utils/plate'

import DiffDisplay from './diff-display'

interface ContentDisplayProps {
	content?: string | null
	contentUrl?: string | null
	customButton?: (data: { content: string }) => React.ReactNode
	enableDiff?: boolean
	id?: string
	isLoading?: boolean
	reverseDiff?: boolean
	showCopy?: boolean
}

export default function ContentDisplay({
	content: propContent,
	id = DUAL_VIEW_EDITOR_ID,
	isLoading,
	enableDiff,
	showCopy,
	reverseDiff,
	customButton = () => null,
	contentUrl,
}: ContentDisplayProps) {
	const { data: fetchedContent, isPending: isFetchingContent } = useFileContent(
		{ url: contentUrl }
	)

	const content = useMemo(() => {
		return propContent ?? fetchedContent
	}, [propContent, fetchedContent])

	const [showDiff, setShowDiff] = useState(false)

	const toggleDiff = useCallback(() => {
		setShowDiff((prev) => !prev)
	}, [])

	const handleCopy = useCallback(() => {
		if (!content) {
			return
		}
		void navigator.clipboard.writeText(getTextFromTextOrValue(content))
		toast.success('Content copied successfully!')
	}, [content])

	if (isLoading || (!!contentUrl && isFetchingContent)) {
		return <DualViewLoader />
	}

	if (!content) {
		return (
			<div className="text-fm-tertiary p-4">
				<p>No Content Available!</p>
			</div>
		)
	}

	return (
		<div className="relative">
			<If condition={enableDiff}>
				<div className="absolute top-4 z-100 flex w-full justify-end gap-2 px-6">
					{customButton({ content })}
					<If condition={showCopy && !!content}>
						<Button
							tooltip="Copy Content"
							variant="outline"
							size="sm"
							onClick={handleCopy}
						>
							Copy
						</Button>
					</If>
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
			<IfElse condition={!!(showDiff && enableDiff)}>
				<If>
					<DiffDisplay content={content} reverse={reverseDiff} />
				</If>
				<Else>
					<RenderedContent id={id} content={content} />
				</Else>
			</IfElse>
		</div>
	)
}

const RenderedContent = ({ content, id }: { content?: string; id: string }) => {
	const editor = useMyEditor({
		content: content ?? '',
		id,
		simplified: true,
	})

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
