import React, { useCallback, useEffect, useRef } from 'react'
import useLaserStore, {
	getLaser,
	setActiveLaser,
	setLaser,
} from '@/store/laser-store'
import { cn } from '@udecode/cn'
import { TDescendant, TElement, TText } from '@udecode/plate-common'
import {
	PlateLeaf,
	PlateLeafProps,
	useEditorRef,
} from '@udecode/plate-common/react'

import { TLaserLeafChildren } from '@/lib/plate/types/block'

import LaserRephrase from './laser-rephrase'

function getLaserKey(elem: TText) {
	return Object.keys(elem).find((key) => key.startsWith('laser-id-'))
}

function getMethodId(elem: TText) {
	const method = Object.keys(elem).find((key) =>
		key.startsWith('laser-method-')
	)
	return method?.split('-').pop()
}

export const LaserLeaf = ({ className, ...props }: PlateLeafProps) => {
	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
	const { children, leaf } = props
	// const {} = useEditorState()
	const editor = useEditorRef()
	const [rephrasedText, setRephrasedText] = React.useState<TElement | null>(
		null
	)
	const key = getLaserKey(leaf)
	const methodId = getMethodId(leaf)
	const divRef = useRef<HTMLDivElement>(null)
	const areaRef = useRef<HTMLDivElement>(null)
	const btnRef = useRef<HTMLButtonElement>(null)

	useEffect(() => {
		if (!key || !divRef?.current) return
		let laser = getLaser(key)
		laser ??= { prompt: '' }
		const rect = divRef.current?.getBoundingClientRect()
		if (!rect) return
		setLaser({
			laser: {
				...laser,
				clientX: rect.x,
				clientY: rect.y,
			},
			id: key,
		})
	}, [divRef, key])

	const { active: activeLaser } = useLaserStore()

	const getSelectedText = useCallback(() => {
		if (!key) return { text: leaf.text, prevtext: '', nexttext: '' }
		const { text } = leaf
		let prevtext = ''
		let nexttext = ''

		const descendants: TDescendant[] = (children as TLaserLeafChildren).props
			.parent.children
		const texts = descendants.map((child) => child.text)

		const laserIndex = descendants.findIndex(
			(child) => child.laser && key in child
		)

		if (laserIndex !== -1) {
			prevtext = texts.slice(0, laserIndex).join('').split('\n').pop() || ''
			nexttext =
				texts
					.slice(laserIndex + 1)
					.join('')
					.split('\n')
					.shift() || ''
		}

		return { text, prevtext, nexttext }
	}, [key, leaf, children])

	const getPreviousElement = useCallback(() => {
		const { prevtext, nexttext, text } = getSelectedText()
		return {
			type: 'p',
			children: [{ text: prevtext }, { text }, { text: nexttext }],
		} as TElement
	}, [getSelectedText])

	const onResponse = useCallback(
		(text: string) => {
			const { nexttext, prevtext } = getSelectedText()
			const newRephrased: TElement = {
				type: 'p',
				children: [{ text: prevtext }, { text }, { text: nexttext }],
			}
			setRephrasedText(newRephrased)
		},
		[getSelectedText]
	)

	const traverseAndReplace = useCallback(
		(node: TDescendant, text: string) => {
			if (!key) return
			if (key in node) {
				node.text = text
				const keys = Object.keys(node).filter((key) => key.startsWith('laser'))
				keys.forEach((key) => {
					delete node[key]
				})
			} else if ('children' in node) {
				;(node.children as TDescendant[]).forEach((child) =>
					traverseAndReplace(child, text)
				)
			}
		},
		[key]
	)

	const onRephrase = useCallback(
		(text: string) => {
			try {
				const val = structuredClone(editor.children)
				val.forEach((child) => traverseAndReplace(child, text))
				editor.tf.setValue(val)
			} catch (error) {
				console.error(error)
			}
		},
		[editor, traverseAndReplace]
	)

	const traverse = useCallback(
		(node: TDescendant) => {
			if (!key) return
			if (key in node) {
				const keys = Object.keys(node).filter((key) => key.startsWith('laser'))
				keys.forEach((key) => {
					delete node[key]
				})
			} else if ('children' in node) {
				;(node.children as TDescendant[]).forEach(traverse)
			}
		},
		[key]
	)

	const onResetLeaf = useCallback(() => {
		try {
			const val = structuredClone(editor.children)
			val.forEach(traverse)
			editor.tf.setValue(val)
		} catch (error) {
			console.error(error)
		}
	}, [editor, traverse])

	const resetActive = useCallback(() => {
		setActiveLaser(null)
	}, [])

	useEffect(() => {
		if (!key) return
		let laser = getLaser(key)
		laser ??= { prompt: '' }
		setLaser({
			laser: {
				...laser,
			},
			id: key,
		})
	}, [key])

	// const showPrompt = promptActive === key && active === key

	const handleBlur = useCallback(
		(e: React.FocusEvent) => {
			if (activeLaser !== key) return
			const responseDiv = document.getElementById(`leaf-response-${key}`)
			if (
				!areaRef.current?.contains(e.relatedTarget) &&
				!responseDiv?.contains(e.relatedTarget)
			) {
				resetActive()
			} else {
				btnRef.current?.focus()
			}
		},
		[resetActive, key, activeLaser]
	)

	useEffect(() => {
		if (activeLaser === key) {
			btnRef.current?.focus()
		}
	}, [activeLaser, key])

	// console.log({ key, methodId, activeLaser })

	return (
		<PlateLeaf
			ref={areaRef}
			{...props}
			onClick={() => {
				if (!key) return
				setActiveLaser(key)
				btnRef.current?.focus()
			}}
			className={cn(
				'relative border-b-2 border-b-primary/40',
				'bg-primary/40',
				className
			)}
		>
			{children}
			<button
				ref={btnRef}
				onFocus={() => {
					if (!key) return
					setActiveLaser(key)
				}}
				onBlur={handleBlur}
				className="w-0"
			/>
			<div
				ref={divRef}
				id={`toolbar-${key}`}
				onClick={(e) => {
					e.stopPropagation()
				}}
				className={cn(
					'absolute bottom-0 z-[9999] max-w-[75vw] translate-y-full whitespace-nowrap rounded border bg-popover px-1 shadow-md print:hidden',
					{
						'pointer-events-none opacity-0': activeLaser !== key,
						'opacity-100': activeLaser === key,
					}
				)}
			>
				{!!methodId && (
					<LaserRephrase
						promptInput={(leaf['laser-inserted-prompt'] as string) || ''}
						onResetLeaf={onResetLeaf}
						methodId={methodId}
						elemKey={key || null}
						getSelectedText={getSelectedText}
						onResponse={onResponse}
						reset={resetActive}
						onRephrase={onRephrase}
						previous={[getPreviousElement()]}
						current={rephrasedText ? [structuredClone(rephrasedText)] : null}
					/>
				)}
			</div>
		</PlateLeaf>
	)
}
