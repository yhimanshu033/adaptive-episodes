'use client'

import * as React from 'react'
import { SuggestionPlugin } from '@platejs/suggestion/react'
import {
	type AnyPluginConfig,
	type NodeEntry,
	type Path,
	type TElement,
	type TSuggestionText,
} from 'platejs'
import type { PlateElementProps, RenderNodeWrapper } from 'platejs/react'
import { useEditorRef, usePluginOption } from 'platejs/react'

import {
	Popover,
	PopoverAnchor,
	PopoverContent,
} from '@/components/aural-ui/popover'

import { suggestionPlugin } from '../editor/plugins/suggestion-kit'
import { BlockSuggestionCard, useResolveSuggestion } from './block-suggestion'

export const SuggestionRenderer: RenderNodeWrapper<AnyPluginConfig> = (
	props
) => {
	const { editor, element } = props

	const blockPath = editor.api.findPath(element)

	// Avoid duplicate in table or column
	if (!blockPath || blockPath.length > 1) {
		return
	}

	const suggestionNodes = [
		...editor.getApi(SuggestionPlugin).suggestion.nodes({ at: blockPath }),
	]

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const BlockSuggestionContentWrapper = (props: any) => (
		<BlockSuggestionContent
			blockPath={blockPath}
			suggestionNodes={suggestionNodes}
			{...props}
		/>
	)

	BlockSuggestionContentWrapper.displayName = 'BlockSuggestionContentWrapper'
	return BlockSuggestionContentWrapper
}

const BlockSuggestionContent = ({
	blockPath,
	children,
	suggestionNodes,
}: PlateElementProps & {
	blockPath: Path
	suggestionNodes: NodeEntry<TElement | TSuggestionText>[]
}) => {
	const editor = useEditorRef()

	const resolvedSuggestions = useResolveSuggestion(suggestionNodes, blockPath)
	const activeSuggestionId = usePluginOption(suggestionPlugin, 'activeId')

	const activeSuggestion = React.useMemo(() => {
		return activeSuggestionId
			? resolvedSuggestions.find((s) => s.suggestionId === activeSuggestionId)
			: null
	}, [activeSuggestionId, resolvedSuggestions])

	const anchorElement = React.useMemo(() => {
		if (!activeSuggestion) {
			return null
		}

		// Find the suggestion node that matches the active suggestion
		const activeNode = suggestionNodes.find(
			([node]) =>
				editor.getApi(SuggestionPlugin).suggestion.nodeId(node) ===
				activeSuggestion.suggestionId
		)

		if (!activeNode) {
			return null
		}

		return editor.api.toDOMNode(activeNode[0])!
	}, [activeSuggestion, suggestionNodes, editor])

	// Only show popover when there's an active suggestion in this block
	const shouldShowPopover = Boolean(activeSuggestion && anchorElement)

	if (resolvedSuggestions.length === 0) {
		return <div className="w-full">{children}</div>
	}

	return (
		<div className="flex w-full justify-between">
			<Popover open={shouldShowPopover}>
				<div className="w-full">{children}</div>

				{anchorElement && (
					<PopoverAnchor
						asChild
						className="w-full"
						virtualRef={{ current: anchorElement }}
					/>
				)}

				{shouldShowPopover && (
					<PopoverContent
						className="bg-fm-neutral-200 max-h-[min(50dvh,calc(-24px+var(--radix-popper-available-height)))] w-[380px] max-w-[calc(100vw-24px)] min-w-[130px] overflow-y-auto p-0 data-[state=closed]:opacity-0"
						onCloseAutoFocus={(e) => e.preventDefault()}
						onOpenAutoFocus={(e) => e.preventDefault()}
						align="start"
						side="bottom"
					>
						<BlockSuggestionCard
							key={activeSuggestion!.suggestionId}
							idx={0}
							isLast={true}
							suggestion={activeSuggestion!}
							isPopover
						/>
					</PopoverContent>
				)}
			</Popover>
		</div>
	)
}

BlockSuggestionContent.displayName = 'BlockSuggestionContent'
