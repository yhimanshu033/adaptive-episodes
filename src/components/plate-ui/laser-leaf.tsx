import React, { useCallback, useEffect, useRef } from 'react'
import useLaserStore, {
	getLaser,
	setActiveLaser,
	setLaser,
} from '@/store/laser-store'
import { cn } from '@udecode/cn'
import {
	getNodeEntries,
	TDescendant,
	TElement,
	TText,
} from '@udecode/plate-common'
import {
	PlateLeaf,
	PlateLeafProps,
	useEditorRef,
	useElement,
} from '@udecode/plate-common/react'
import { findNodePath } from '@udecode/slate-react'

import { LaserPlugin } from '@/lib/plate/plugins/laser-plugin'
import { Node as BlockNode, TLaserLeafChildren } from '@/lib/plate/types/block'

import RephraseSelection from './rephrase-selection'

function getLaserKey(elem: TText) {
	return Object.keys(elem).find((key) => key.startsWith('laser-'))
}

export const LaserLeaf = ({ className, ...props }: PlateLeafProps) => {
	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
	const { children, leaf } = props
	const editor = useEditorRef()
	const element = useElement(LaserPlugin.key)
	const [rephrasedText, setRephrasedText] = React.useState<TElement | null>(
		null
	)
	const key = getLaserKey(leaf)
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

	const onRephrase = useCallback(
		(text: string) => {
			try {
				const nodes = getNodeEntries(
					editor
				).toArray() as unknown as BlockNode[][]
				const childrenCopy = structuredClone(element.children)

				childrenCopy.forEach((child) => {
					if (child.laser && child.text === leaf.text) {
						child.text = text
						delete child.laser
					}
				})

				nodes[0][0].children.forEach((child: TElement) => {
					if (child.id === element.id) {
						child.children = childrenCopy
					}
				})
				const path = findNodePath(editor, element)
				if (!path) return
				editor.removeNodes({
					at: path,
				})
				editor.insertNodes(
					{
						...element,
						children: childrenCopy,
					},
					{
						at: path,
					}
				)
			} catch (error) {
				console.error(error)
			}
		},
		[editor, element, leaf.text]
	)

	const resetActive = useCallback(() => {
		setActiveLaser(null)
	}, [activeLaser])

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

	const handleBlur = useCallback(
		(e: React.FocusEvent) => {
			if (activeLaser !== key) return
			if (!areaRef.current?.contains(e.relatedTarget)) resetActive()
			else {
				btnRef.current?.focus()
			}
		},
		[activeLaser]
	)

	useEffect(() => {
		if (activeLaser === key) {
			btnRef.current?.focus()
		}
	}, [])

	return (
		<PlateLeaf
			ref={areaRef}
			{...props}
			onClick={() => {
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
				<RephraseSelection
					elemKey={key || null}
					getSelectedText={getSelectedText}
					onResponse={onResponse}
					reset={resetActive}
					onRephrase={onRephrase}
					previous={[getPreviousElement()]}
					current={rephrasedText ? [structuredClone(rephrasedText)] : null}
				/>
			</div>
		</PlateLeaf>
	)
}
