'use client'

import * as React from 'react'
import { LASER_LEAF_KEYS } from '@/constants/editor-constants'
import useLaserStore from '@/store/laser-store'
import { TText, type NodeEntry, type TElement } from 'platejs'
import type { PlateElementProps, RenderNodeWrapper } from 'platejs/react'
import { useEditorRef } from 'platejs/react'
import { useShallow } from 'zustand/react/shallow'

import LaserRephrase from '@/components/plate-ui/laser-rephrase'
import {
	Popover,
	PopoverAnchor,
	PopoverContent,
	PopoverTrigger,
} from '@/components/plate-ui/popover'

export const BlockLaser: RenderNodeWrapper = (props) => {
	const { editor, element } = props

	const blockPath = editor.api.findPath(element)

	// avoid duplicate in table or column
	if (!blockPath || blockPath.length > 1) {
		return
	}

	const laserNodes = [...editor.api.nodes({ at: blockPath })].filter(
		([node]) => !!node['laser']
	)

	if (laserNodes.length === 0) {
		return
	}
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const BlockLaserWrapper = (props: any) => (
		<BlockLaserContent laserNodes={laserNodes} {...props} />
	)
	BlockLaserWrapper.displayName = 'BlockLaserWrapper'

	return BlockLaserWrapper
}

const BlockLaserContent = ({
	children,
	laserNodes,
}: PlateElementProps & {
	laserNodes: NodeEntry<TText | TElement>[]
}) => {
	const editor = useEditorRef()

	const { store: laserStore, setActiveLaser } = useLaserStore()
	const laserActive = laserStore(useShallow((state) => state.active))

	const activeNode = React.useMemo(() => {
		let activeNode: NodeEntry | undefined

		if (laserNodes.length && laserActive) {
			activeNode = laserNodes.find(([node]) => {
				const keys = Object.keys(node)
				const idKey = keys.find((item) =>
					item.startsWith(LASER_LEAF_KEYS.ID_START)
				)
				return idKey === laserActive
			})
		}
		return activeNode as [TText] | undefined
	}, [laserNodes, laserActive])

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
					id={LASER_LEAF_KEYS.POPOVER}
					className="mx-auto max-h-[min(50dvh,calc(-24px+var(--radix-popper-available-height)))] w-[668px] max-w-[calc(100vw-24px)] min-w-[130px] overflow-y-auto p-0 data-[state=closed]:opacity-0"
					onCloseAutoFocus={(e) => e.preventDefault()}
					onOpenAutoFocus={(e) => e.preventDefault()}
					onBlur={(e) => {
						if (
							e.currentTarget.contains(e.relatedTarget) ||
							e.relatedTarget?.id === LASER_LEAF_KEYS.POPOVER
						) {
							return
						}
						setActiveLaser(null)
					}}
					align="center"
					side="bottom"
				>
					{activeNode?.[0] && (
						<>
							<LaserRephrase editor={editor} leaf={activeNode?.[0]} />
							<button
								autoFocus
								className="pointer-events-none absolute h-0 w-0 opacity-0"
							/>
						</>
					)}
				</PopoverContent>
				<div className="absolute left-0 size-0 select-none">
					<PopoverTrigger />
				</div>
			</Popover>
		</div>
	)
}
