import React, { useEffect, useMemo, useRef } from 'react'
import {
	AFTER_PAGE_BREAK_CLASSNAME,
	CONSISTENT_CLASSNAMES,
	EDITOR_FIRST_DIV_CLASSNAME,
	FOCUS_EDITOR_CLASSNAME,
	LINES,
	REMAINING_HEIGHT_CLASSNAME,
	UNFOCUS_EDITOR_CLASSNAME,
} from '@/constants/editor-constants'
import useSaving from '@/hooks/use-saving'
import useAIStore from '@/store/ai-store'
import useLaserStore from '@/store/laser-store'
import useCustomPlateStore from '@/store/plate-store'
import { cn } from '@udecode/cn'
import { collapseSelection } from '@udecode/plate-common'
import type { PlateContentProps } from '@udecode/plate-common/react'
import {
	focusEditor,
	PlateContent,
	useEditorRef,
	useEditorState,
} from '@udecode/plate-common/react'
import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'
import { useShallow } from 'zustand/react/shallow'

import useEpisodeId from '@/providers/episode-id-provider'
import DiffView from '@/lib/plate/plugins/diff'
import { clearColors } from '@/lib/utils/plate'

import { ESidebar } from '@/types/plate-types'

const editorVariants = cva(
	cn(
		'relative overflow-x-auto whitespace-pre-wrap break-words',
		'w-full rounded-md px-6 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none',
		'[&_[data-slate-placeholder]]:text-muted-foreground [&_[data-slate-placeholder]]:!opacity-100',
		'[&_[data-slate-placeholder]]:top-[auto_!important]',
		'[&_strong]:font-bold'
	),
	{
		defaultVariants: {
			focusRing: true,
			size: 'sm',
			variant: 'outline',
		},
		variants: {
			disabled: {
				true: 'cursor-not-allowed opacity-50',
			},
			focusRing: {
				false: '',
				true: 'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
			},
			focused: {
				true: 'ring-2 ring-ring ring-offset-2',
			},
			size: {
				md: 'text-base',
				sm: 'text-sm',
			},
			variant: {
				ghost: '',
				outline: 'border border-input',
			},
		},
	}
)

export type EditorProps = PlateContentProps &
	VariantProps<typeof editorVariants> & { isAi?: boolean }

const Editor = React.forwardRef<HTMLDivElement, EditorProps>(
	(
		{
			className,
			disabled,
			focusRing,
			focused,
			readOnly,
			size,
			variant,
			isAi,
			...props
		},
		ref
	) => {
		const isPasted = React.useRef(false)
		const editor = useEditorRef()
		const episodeId = useEpisodeId()

		const { store } = useCustomPlateStore()
		const scale = store((state) => state.scale)
		const sidebar = store((state) => state.sidebar)
		const focusMode = store((state) => state.focusMode)
		const fontFamily = store(useShallow((state) => state.fontFamily))

		const [remainingHeight, setRemainingHeight] = React.useState(0)
		const [pages, setPages] = React.useState(1)
		const [ctrSwitch, setCtrSwitch] = React.useState(false)

		const contentRef = useRef<HTMLDivElement>(null)
		const { setEditorCoords } = useLaserStore()

		const { store: AiStore } = useAIStore()
		const responseValue = AiStore(useShallow((state) => state.responseValue))
		const prevValue = AiStore(useShallow((state) => state.prevValue))

		const { children } = useEditorState()
		const { setForceSave } = useSaving()

		const isEmpty = useMemo(
			() =>
				children.length === 1 &&
				children[0].children.length === 1 &&
				children[0].children[0].text === '',
			[children]
		)

		useEffect(() => {
			const editorDiv = contentRef.current
			if (!editorDiv || readOnly) return
			const LINE_HEIGHT = 32
			const MAX_HEIGHT = LINES * LINE_HEIGHT
			let height = 0
			let pages = 1
			for (let i = 0; i < editorDiv.children.length; i++) {
				const currentDiv = editorDiv.children[i] as HTMLDivElement
				const currHeight = currentDiv.classList.contains(
					REMAINING_HEIGHT_CLASSNAME
				)
					? currentDiv.clientHeight - remainingHeight
					: currentDiv.clientHeight

				// for first block
				if (i === 0) {
					currentDiv.classList.add(EDITOR_FIRST_DIV_CLASSNAME)
				} else {
					currentDiv.classList.remove(EDITOR_FIRST_DIV_CLASSNAME)
				}

				// for breaking blocks
				for (const className of CONSISTENT_CLASSNAMES) {
					currentDiv.classList.add(className)
				}

				// for focus mode and unfocus mode
				if (focusMode) {
					currentDiv.classList.add(FOCUS_EDITOR_CLASSNAME)
					for (const className of UNFOCUS_EDITOR_CLASSNAME) {
						currentDiv.classList.remove(className)
					}
				} else {
					currentDiv.classList.remove(FOCUS_EDITOR_CLASSNAME)
					for (const className of UNFOCUS_EDITOR_CLASSNAME) {
						currentDiv.classList.add(className)
					}
				}

				// for identifying last blocks per page
				if (height + currHeight > MAX_HEIGHT && focusMode) {
					currentDiv.classList.add(AFTER_PAGE_BREAK_CLASSNAME)
					height = currHeight
					pages++
				} else {
					height += currHeight
					currentDiv.classList.remove(AFTER_PAGE_BREAK_CLASSNAME)
				}
			}

			// for last block
			setRemainingHeight(MAX_HEIGHT - height)
			setPages(pages)
			setCtrSwitch((p) => !p)
			// eslint-disable-next-line react-hooks/exhaustive-deps
		}, [children, contentRef.current, readOnly, scale, focusMode])

		useEffect(() => {
			if (!contentRef.current) return
			const rect = contentRef.current?.getBoundingClientRect()
			if (!rect) return
			setEditorCoords(rect.x, rect.y)

			// eslint-disable-next-line react-hooks/exhaustive-deps
		}, [contentRef])

		useEffect(() => {
			if (!isPasted.current) return

			isPasted.current = false
			const clearedColors = clearColors(children)
			if (JSON.stringify(clearedColors) === JSON.stringify(children)) return
			const currentTarget = editor.selection?.anchor
			editor.tf.setValue(clearedColors)
			collapseSelection(editor)
			focusEditor(editor, currentTarget)
		}, [children, editor])

		function handlePaste() {
			isPasted.current = true
			setForceSave(true)
		}

		const counter = useMemo(() => 'ctr' + (ctrSwitch ? 'a' : 'b'), [ctrSwitch]) // to re-initialize the counter on children re-render

		return (
			<div
				id={`editor-container-${episodeId}`}
				ref={ref}
				className="relative size-full"
				style={{ fontFamily: `var(${fontFamily})` }}
			>
				{focusMode && (
					// eslint-disable-next-line react/no-unknown-property
					<style jsx global>
						{`
							/* for counting page numbers */
							.counter-parent {
								counter-reset: ${counter};
							}

							/* for page numbers before page break */
							.${AFTER_PAGE_BREAK_CLASSNAME}::before {
								content: counter(${counter}) '/${pages}';
								counter-increment: ${counter};
								display: block;
								position: absolute;
								top: 0rem;
								right: 0rem;
								font-style: italic;
								font-size: 0.8rem;
								line-height: 0.8rem;
								padding: 0.25rem;
							}

							/* for page numbers after last block */
							.last-padding-div::after {
								content: counter(${counter}) '/${pages}';
								counter-increment: ${counter};
								display: block;
								position: absolute;
								bottom: 0rem;
								right: 0rem;
								font-style: italic;
								font-size: 0.8rem;
								line-height: 0.8rem;
								padding: 0.25rem;
							}
						`}
					</style>
				)}
				{sidebar === ESidebar.CHATBOT && responseValue && prevValue && !isAi ? (
					<DiffView
						current={responseValue}
						previous={prevValue}
						className={cn(
							editorVariants({
								disabled,
								focusRing,
								focused,
								size,
								variant,
							}),
							className
						)}
					/>
				) : (
					<>
						<PlateContent
							className={cn(
								editorVariants({
									disabled,
									focusRing,
									focused,
									size,
									variant,
								}),
								className,
								'h-fit origin-top-left px-6',
								{
									'first-of-type:*:-mx-6 first-of-type:*:border-x first-of-type:*:px-6 first-of-type:*:pt-[var(--editor-break-padding)]':
										isEmpty && !focusMode,
									'counter-parent bg-background-editor first-of-type:*:pt-[var(--editor-break-padding)]':
										focusMode,
								},
								readOnly ? 'py-5' : 'py-0'
							)}
							ref={contentRef}
							onPaste={handlePaste}
							readOnly={disabled ?? readOnly}
							autoFocus
							aria-disabled={disabled}
							data-plate-selectable
							disableDefaultStyles
							style={{
								fontSize: `${16 * scale}px`,
								lineHeight: `${24 * scale}px`,
								...props.style,
							}}
							{...props}
						/>
						<div
							style={{ minHeight: `${focusMode ? remainingHeight : 24}px` }}
							className={cn('pb-[var(--editor-break-padding)]', {
								'last-padding-div mb-6 bg-background-editor': focusMode,
								'border-x border-b': !focusMode,
							})}
						/>
					</>
				)}
				{isAi && (
					<div
						id="test"
						style={{
							height: contentRef.current?.clientHeight,
							width: contentRef?.current?.clientWidth,
						}}
					/>
				)}
			</div>
		)
	}
)
Editor.displayName = 'Editor'

export { Editor }
