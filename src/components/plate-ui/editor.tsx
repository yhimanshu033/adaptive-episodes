import React, { useEffect, useRef } from 'react'
import useAIStore from '@/store/ai-store'
import { setEditorCoords } from '@/store/laser-store'
import useCustomPlateStore from '@/store/plate-store'
import usePlateStore from '@/store/plate-store'
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
		const scale = useCustomPlateStore((state) => state.scale)
		// const marginLeft = scale < 1 ? (1 - scale) * 50 : 0
		const mihHeight = 100 / scale
		const minWidth = scale < 1 ? 100 / scale : 100 / scale
		const contentRef = useRef<HTMLDivElement>(null)

		useEffect(() => {
			if (!contentRef.current) return
			const rect = contentRef.current?.getBoundingClientRect()
			if (!rect) return
			setEditorCoords(rect.x, rect.y)
		}, [contentRef])

		const sidebar = usePlateStore((state) => state.sidebar)
		const responseValue = useAIStore(useShallow((state) => state.responseValue))
		const prevValue = useAIStore(useShallow((state) => state.prevValue))

		return (
			<div id="editor-container" ref={ref} className="relative size-full">
				{sidebar === 'chatbot' && responseValue && prevValue ? (
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
							// marginLeft: `${marginLeft}%`,
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

// 100 -> 75 ---> x*0.75 = 100 100/12.
