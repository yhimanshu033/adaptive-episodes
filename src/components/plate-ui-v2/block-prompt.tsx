'use client'

import * as React from 'react'
import { LASER_PROMPT_KEYS } from '@/constants/editor-constants'
import useLaserStore from '@/store/laser-store'
import { TText, type NodeEntry, type TElement } from 'platejs'
import type { PlateElementProps, RenderNodeWrapper } from 'platejs/react'
import { useEditorRef } from 'platejs/react'
import { useShallow } from 'zustand/react/shallow'

import FloatingPrompt from '@/components/plate-ui/floating-prompt'
import {
	Popover,
	PopoverAnchor,
	PopoverContent,
	PopoverTrigger,
} from '@/components/plate-ui/popover'
import { PromptPluginT } from '@/lib/plate/plugins/laser-plugin'

export const BlockPrompt: RenderNodeWrapper<PromptPluginT> = (props) => {
	const { editor, element } = props

	const blockPath = editor.api.findPath(element)

	// avoid duplicate in table or column
	if (!blockPath || blockPath.length > 1) {
		return
	}

	const promptNodes = [...editor.api.nodes({ at: blockPath })].filter(
		([node]) => !!node[LASER_PROMPT_KEYS.KEY]
	)

	if (promptNodes.length === 0) {
		return
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const BlockPromptContentWrapper = (props: any) => (
		<BlockPromptContent promptNodes={promptNodes} {...props} />
	)
	BlockPromptContentWrapper.displayName = 'BlockPromptContentWrapper'

	return BlockPromptContentWrapper
}

const BlockPromptContent = ({
	children,
	promptNodes,
}: PlateElementProps & {
	promptNodes: NodeEntry<TText | TElement>[]
}) => {
	const editor = useEditorRef()

	const { store: laserStore } = useLaserStore()
	const promptActive = laserStore(useShallow((state) => state.promptActive))

	const activeNode = React.useMemo(() => {
		let activeNode: NodeEntry | undefined

		if (promptNodes.length && promptActive) {
			activeNode = promptNodes.find(([node]) => {
				const keys = Object.keys(node)
				const idKey = keys.find((item) =>
					item.startsWith(LASER_PROMPT_KEYS.ID_START)
				)
				return idKey === promptActive
			})
		}
		return activeNode
	}, [promptNodes, promptActive])

	const anchorElement = React.useMemo(() => {
		if (!activeNode) {
			return null
		}

		return editor.api.toDOMNode(activeNode[0])!
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [activeNode, editor.api])

	return (
		<div className="relative flex w-full justify-between">
			<Popover open={!!activeNode}>
				<div className="w-full">{children}</div>

				{anchorElement && (
					<PopoverAnchor
						asChild
						className="w-full"
						virtualRef={{ current: anchorElement }}
					/>
				)}

				<PopoverContent
					id={LASER_PROMPT_KEYS.POPOVER}
					className="max-h-[min(50dvh,calc(-24px+var(--radix-popper-available-height)))] w-[668px] max-w-[calc(100vw-24px)] min-w-[130px] overflow-y-auto p-0 data-[state=closed]:opacity-0"
					onCloseAutoFocus={(e) => e.preventDefault()}
					onOpenAutoFocus={(e) => e.preventDefault()}
					align="center"
					side="bottom"
				>
					<FloatingPrompt />
				</PopoverContent>
				<div className="absolute left-0 size-0 select-none">
					<PopoverTrigger />
				</div>
			</Popover>
		</div>
	)
}
