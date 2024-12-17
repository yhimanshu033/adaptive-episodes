import React, { useEffect, useRef } from 'react'
import useAIStore from '@/store/ai-store'
import useLaserStore from '@/store/laser-store'
import useCustomPlateStore from '@/store/plate-store'
import { cn } from '@udecode/cn'
import type { PlateContentProps } from '@udecode/plate-common/react'
import { PlateContent } from '@udecode/plate-common/react'
import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'
import { useShallow } from 'zustand/react/shallow'

import DiffView from '@/lib/plate/plugins/diff'

const editorVariants = cva(
	cn(
		'relative overflow-x-auto whitespace-pre-wrap break-words',
		'min-h-[80px] w-full rounded-md bg-background px-6 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none',
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
		const { store } = useCustomPlateStore()
		const scale = store((state) => state.scale)
		const mihHeight = 100 / scale
		const minWidth = 100 / scale
		const contentRef = useRef<HTMLDivElement>(null)
		const { setEditorCoords } = useLaserStore()

		useEffect(() => {
			if (!contentRef.current) return
			const rect = contentRef.current?.getBoundingClientRect()
			if (!rect) return
			console.log(rect)
			setEditorCoords(rect.x, rect.y)
		}, [contentRef, setEditorCoords])

		const sidebar = store((state) => state.sidebar)
		const { store: AiStore } = useAIStore()
		const responseValue = AiStore(useShallow((state) => state.responseValue))
		const prevValue = AiStore(useShallow((state) => state.prevValue))

		return (
			<div id="editor-container" ref={ref} className="relative size-full">
				{sidebar === 'chatbot' && responseValue && prevValue && !isAi ? (
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
							'absolute h-fit origin-top-left'
						)}
						ref={contentRef}
						readOnly={disabled ?? readOnly}
						aria-disabled={disabled}
						data-plate-selectable
						disableDefaultStyles
						style={{
							transform: `scale(${scale})`,
							minHeight: `${mihHeight}%`,
							width: `${minWidth}%`,
							...props.style,
						}}
						{...props}
					/>
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
