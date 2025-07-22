'use client'

import * as React from 'react'
import { CornerDownLeftIcon } from 'lucide-react'
import type { TSuggestionData, TSuggestionText } from 'platejs'
import type { PlateLeafProps, RenderNodeWrapper } from 'platejs/react'
import { PlateLeaf, useEditorPlugin, usePluginOption } from 'platejs/react'

import {
	suggestionPlugin,
	type SuggestionConfig,
} from '@/components/editor/plugins/suggestion-kit'
import { cn } from '@/lib/utils/helpers'

export function SuggestionLeaf(props: PlateLeafProps<TSuggestionText>) {
	const { api, setOption } = useEditorPlugin(suggestionPlugin)
	const leaf = props.leaf

	const leafId: string = api.suggestion.nodeId(leaf) ?? ''

	const dataList = api.suggestion.dataList(leaf)

	const hasRemove = dataList.some((data) => data.type === 'remove')

	const diffOperation = { type: hasRemove ? 'delete' : 'insert' } as const

	const Component = ({ delete: 'del', insert: 'ins', update: 'span' } as const)[
		diffOperation.type
	]

	return (
		<PlateLeaf
			className={cn(
				'text-fm-tag-emerald relative bg-transparent hover:bg-transparent',
				leaf.suggestionDeletion &&
					'text-fm-primary decoration-fm-emerald-300 border-fm-emerald-200 border-2 border-x-0 border-y line-through'
			)}
			{...props}
			as={Component}
			attributes={{
				id: `suggestion-leaf-${leafId}`,
				...props.attributes,
				onMouseEnter: () => setOption('hoverId', leafId),
				onMouseLeave: () => setOption('hoverId', null),
			}}
		>
			{props.children}
		</PlateLeaf>
	)
}

export const SuggestionLineBreak: RenderNodeWrapper<SuggestionConfig> = ({
	api,
	element,
}) => {
	if (!api.suggestion.isBlockSuggestion(element)) {
		return
	}

	const suggestionData = element.suggestion

	if (!suggestionData?.isLineBreak) {
		return
	}

	return function Component({ children }) {
		return (
			<React.Fragment>
				{children}
				<SuggestionLineBreakContent suggestionData={suggestionData} />
			</React.Fragment>
		)
	}
}

function SuggestionLineBreakContent({
	suggestionData,
}: {
	suggestionData: TSuggestionData
}) {
	const { type } = suggestionData
	const isRemove = type === 'remove'
	const isInsert = type === 'insert'

	const activeSuggestionId = usePluginOption(suggestionPlugin, 'activeId')
	const hoverSuggestionId = usePluginOption(suggestionPlugin, 'hoverId')

	const isActive = activeSuggestionId === suggestionData.id
	const isHover = hoverSuggestionId === suggestionData.id

	const spanRef = React.useRef<HTMLSpanElement>(null)

	return (
		<span
			ref={spanRef}
			className={cn(
				'border-b-brand/[.24] bg-brand/[.08] text-brand/80 absolute border-b-2 text-justify no-underline transition-colors duration-200',
				isInsert &&
					(isActive || isHover) &&
					'border-b-brand/[.60] bg-brand/[.13]',
				isRemove &&
					'border-b-gray-300 bg-gray-300/25 text-gray-400 line-through',
				isRemove &&
					(isActive || isHover) &&
					'border-b-gray-500 bg-gray-400/25 text-gray-500 no-underline'
			)}
			style={{
				bottom: 4.5,
				height: 21,
			}}
			contentEditable={false}
		>
			<CornerDownLeftIcon className="mt-0.5 size-4" />
		</span>
	)
}
