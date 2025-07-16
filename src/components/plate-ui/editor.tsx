import React, { useEffect, useMemo, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import {
	AFTER_PAGE_BREAK_CLASSNAME,
	LINES,
	TRANSITION_DURATION,
} from '@/constants/editor-constants'
import { GLOBAL_LOCALIZE } from '@/constants/global-constants'
import useGlobalFindAndReplace from '@/hooks/use-global-find-and-replace'
import useSaving from '@/hooks/use-saving'
import useAIStore from '@/store/ai-store'
import useEditorExtendedStore from '@/store/extended-store'
import useLaserStore from '@/store/laser-store'
import useCustomPlateStore from '@/store/plate-store'
import { cn } from '@udecode/cn'
import { collapseSelection } from '@udecode/plate-common'
import type { PlateContentProps } from '@udecode/plate-common/react'
import {
	focusEditor,
	PlateContent,
	useEditorPlugin,
	useEditorRef,
	useEditorState,
} from '@udecode/plate-common/react'
import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'
import { isEqual } from 'lodash'
import { useDebounceValue } from 'usehooks-ts'
import { useShallow } from 'zustand/react/shallow'

import DiffEditor from '@/components/editor/diff-editor'
import useEpisodeId from '@/providers/episode-id-provider'
import { FindReplacePlugin } from '@/lib/plate/plugins/find-replace'
import { clearColors } from '@/lib/utils/plate'

import { ESidebar } from '@/types/plate-types'

const editorVariants = cva(
	cn(
		'relative overflow-x-auto whitespace-pre-wrap break-words',
		'w-full rounded-md ~px-6 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-hidden',
		'**:data-slate-placeholder:text-muted-foreground **:data-slate-placeholder:opacity-100!',
		'**:data-slate-placeholder:top-[auto_!important]',
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
				outline: 'border border-fm-divider-tertiary',
			},
		},
	}
)

export type EditorProps = PlateContentProps &
	VariantProps<typeof editorVariants> & { isAi?: boolean }

const LINE_HEIGHT = 38
const MAX_HEIGHT = LINES * LINE_HEIGHT

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

		const { addExtendedContentMap } = useEditorExtendedStore()
		const { options, replacedContentMap, setReplacedContentMap } =
			useGlobalFindAndReplace()
		const { setOptions, getOptions } = useEditorPlugin(FindReplacePlugin)

		const searchParams = useSearchParams()
		const globalLocalize = searchParams.get(GLOBAL_LOCALIZE)

		const [debouncedSidebar] = useDebounceValue(
			sidebar,
			TRANSITION_DURATION * 2
		)

		const isDiff = useMemo(
			() => sidebar === ESidebar.CHATBOT && responseValue && prevValue && !isAi,
			[isAi, sidebar, responseValue, prevValue]
		)

		const isEmpty = useMemo(
			() =>
				children.length === 1 &&
				children[0].children.length === 1 &&
				children[0].children[0].text === '',
			[children]
		)

		useEffect(() => {
			const editorDiv = contentRef.current
			if (!editorDiv || readOnly || isDiff) {
				return
			}

			let height = 0
			let newPages = 1

			const childrenArray = Array.from(editorDiv.children) as HTMLDivElement[]

			for (const currentDiv of childrenArray) {
				const currHeight = currentDiv.clientHeight
				if (height + currHeight > MAX_HEIGHT && focusMode) {
					currentDiv.classList.add(AFTER_PAGE_BREAK_CLASSNAME)
					height = currHeight
					newPages++
				} else {
					currentDiv.classList.remove(AFTER_PAGE_BREAK_CLASSNAME)
					height += currHeight
				}
			}

			const newRemainingHeight = MAX_HEIGHT - height
			setRemainingHeight(newRemainingHeight)
			setPages(newPages)
			setCtrSwitch((p) => !p)

			// eslint-disable-next-line react-hooks/exhaustive-deps
		}, [children, readOnly, scale, focusMode, debouncedSidebar, isDiff])

		useEffect(() => {
			if (!contentRef.current) {
				return
			}
			const rect = contentRef.current?.getBoundingClientRect()

			if (!rect) {
				return
			}
			setEditorCoords(rect.x, rect.y)

			// eslint-disable-next-line react-hooks/exhaustive-deps
		}, [contentRef])

		useEffect(() => {
			if (!isPasted.current) {
				return
			}

			isPasted.current = false
			const clearedColors = clearColors(children)

			if (JSON.stringify(clearedColors) === JSON.stringify(children)) {
				return
			}

			const currentTarget = editor.selection?.anchor
			editor.tf.setValue(clearedColors)

			collapseSelection(editor)
			focusEditor(editor, currentTarget)
		}, [children, editor])

		useEffect(() => {
			if (!globalLocalize) {
				return
			}
			addExtendedContentMap(episodeId, { children })
			// eslint-disable-next-line react-hooks/exhaustive-deps
		}, [children, episodeId, globalLocalize])

		useEffect(() => {
			const current = getOptions()

			if (!globalLocalize || isEqual(current, options)) {
				return
			}
			setOptions(options)

			const updatedChildren = structuredClone(children)
			editor.tf.setValue(updatedChildren)
			// eslint-disable-next-line react-hooks/exhaustive-deps
		}, [options, globalLocalize, setOptions])

		useEffect(() => {
			if (!globalLocalize || !replacedContentMap[episodeId]) {
				return
			}
			editor.tf.setValue(replacedContentMap[episodeId].children)
			setReplacedContentMap((prev) => {
				delete prev[episodeId]
				return prev
			})
		}, [
			replacedContentMap,
			episodeId,
			editor.tf,
			setReplacedContentMap,
			globalLocalize,
		])

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
				{isDiff ? (
					<DiffEditor
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
							'min-h-screen px-6 py-5',
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
								'h-fit origin-top-left *:px-6',
								{
									'px-6 *:first-of-type:-mx-6 *:first-of-type:px-6':
										isEmpty && !focusMode,
									'counter-parent first-of-type:*:pt-[var(--editor-break-padding) bg-background-editor':
										focusMode,
									'border-fm-divider-tertiary bg-fm-neutral-100 border-x border-b py-14 *:px-18':
										!focusMode,
								},
								className
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
								...(!focusMode
									? { minHeight: MAX_HEIGHT }
									: { height: 'fit-content' }),
								...props.style,
							}}
							{...props}
						/>
						{focusMode && (
							<div
								style={{ minHeight: `${remainingHeight}px` }}
								className="last-padding-div bg-background-editor mb-6 pb-(--editor-break-padding)"
							/>
						)}
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
