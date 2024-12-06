/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable  @typescript-eslint/no-unsafe-member-access */
'use client'

import React, { useEffect } from 'react'
import { cn, withRef } from '@udecode/cn'
import type { ClassNames, TEditor } from '@udecode/plate-common'
import {
	useEditorRef,
	type PlateElementProps,
} from '@udecode/plate-common/react'
import {
	useDraggable,
	useDraggableState,
	type DragItemNode,
} from '@udecode/plate-dnd'
import { BlockSelectionPlugin } from '@udecode/plate-selection/react'
import type { DropTargetMonitor } from 'react-dnd'

import { Icons } from '@/components/icons'

import {
	Tooltip,
	TooltipContent,
	TooltipPortal,
	TooltipTrigger,
} from './tooltip'

export interface DraggableProps
	extends PlateElementProps,
		ClassNames<{
			/** Block. */
			block: string

			/** Block and gutter. */
			blockAndGutter: string

			/** Block toolbar in the gutter. */
			blockToolbar: string

			/**
			 * Block toolbar wrapper in the gutter left. It has the height of a line
			 * of the block.
			 */
			blockToolbarWrapper: string

			blockWrapper: string

			/** Button to dnd the block, in the block toolbar. */
			dragHandle: string

			/** Icon of the drag button, in the drag icon. */
			dragIcon: string

			/** Show a dropline above or below the block when dragging a block. */
			dropLine: string

			/** Gutter at the left side of the editor. It has the height of the block */
			gutterLeft: string
		}> {
	/**
	 * Intercepts the drop handling. If `false` is returned, the default drop
	 * behavior is called after. If `true` is returned, the default behavior is
	 * not called.
	 */
	onDropHandler?: (
		editor: TEditor,
		props: {
			dragItem: DragItemNode
			id: string
			monitor: DropTargetMonitor<DragItemNode, unknown>
			nodeRef: any
		}
	) => boolean
}

const DragHandle = () => {
	const editor = useEditorRef()

	return (
		<Tooltip>
			<TooltipTrigger type="button">
				<Icons.dragHandle
					className="size-4 text-muted-foreground"
					onClick={(event) => {
						event.stopPropagation()
						event.preventDefault()
					}}
					onMouseDown={() => {
						editor
							.getApi(BlockSelectionPlugin)
							.blockSelection.resetSelectedIds()
					}}
				/>
			</TooltipTrigger>
			<TooltipPortal>
				<TooltipContent>Drag to move</TooltipContent>
			</TooltipPortal>
		</Tooltip>
	)
}

export const Draggable = withRef<'div', DraggableProps>(
	({ className, classNames = {}, onDropHandler, ...props }, ref) => {
		const { children, element } = props

		const state: any = useDraggableState({ element, onDropHandler })
		const { dropLine, isDragging, isHovered } = state
		const {
			droplineProps,
			groupProps,
			gutterLeftProps,
			previewRef,
			handleRef,
		}: any = useDraggable(state)

		useEffect(() => {
			if (!previewRef.current) return
			// if (!state.isDragging || !state.nodeRef) return
			const selection = window.getSelection()
			selection?.removeAllRanges() // Clear any existing selection
			const range = document.createRange()
			range.selectNodeContents(previewRef.current) // Select the entire content of the node
			selection?.addRange(range)
		}, [state.isDragging, previewRef])

		return (
			<div
				ref={ref}
				className={cn(
					'relative',
					isDragging && 'opacity-50',
					'group',
					className
				)}
				{...groupProps}
			>
				<div
					className={cn(
						'~pointer-events-none absolute -top-px z-50 flex h-full -translate-x-full cursor-grab opacity-0 group-hover:opacity-100',
						classNames.gutterLeft
					)}
					{...gutterLeftProps}
				>
					<div className={cn('flex h-[1.5em]', classNames.blockToolbarWrapper)}>
						<div
							className={cn(
								'pointer-events-auto mr-1 flex items-center',
								classNames.blockToolbar
							)}
						>
							<div
								ref={handleRef}
								className="size-4"
								data-key={element.id as string}
							>
								{/* <DragHandle /> */}
								{isHovered && <DragHandle />}
							</div>
						</div>
					</div>
				</div>

				<div ref={previewRef} className={classNames.blockWrapper}>
					{children}

					{!!dropLine && (
						<div
							className={cn(
								'absolute inset-x-0 h-0.5 opacity-100',
								'bg-ring',
								dropLine === 'top' && '-top-px',
								dropLine === 'bottom' && '-bottom-px',
								classNames.dropLine
							)}
							{...droplineProps}
						/>
					)}
				</div>
			</div>
		)
	}
)
