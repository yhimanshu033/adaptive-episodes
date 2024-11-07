import React, { useCallback, useEffect } from 'react'
import useLaserStore, {
	getLaser,
	setActiveLaser,
	setLaser,
} from '@/store/laser-store'
import { cn } from '@udecode/cn'
import { getNodeEntries, TElement, TText } from '@udecode/plate-common'
import {
	PlateLeaf,
	PlateLeafProps,
	useEditorRef,
	useElement,
} from '@udecode/plate-common/react'
import { findNodePath } from '@udecode/slate-react'

import { LaserPlugin } from '@/lib/plate/plugins/laser-plugin'
import { Node, TLaserLeafChildren } from '@/lib/plate/types/block'

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

	const { active: activeLaser } = useLaserStore()

	const getSelectedText = useCallback(() => {
		const text = leaf.text
		let prevtext = ''
		let nexttext = ''

		const texts: string[] = (
			children as TLaserLeafChildren
		).props.parent.children.map((child) => (child?.text as string) || '')
		const laserIndex = texts.indexOf(text)

		if (laserIndex !== -1) {
			prevtext = texts.slice(0, laserIndex).join('')
			nexttext = texts.slice(laserIndex + 1).join('')
		}

		return { text, prevtext, nexttext }
	}, [children, leaf.text])

	const onResponse = useCallback(
		(text: string) => {
			const childrenCopy = structuredClone(element.children)

			childrenCopy.forEach((child) => {
				if (child.laser && child.text === leaf.text) {
					child.text = text
					delete child.laser
				}
			})
			const rephrased = {
				...element,
				children: childrenCopy,
			}
			setRephrasedText(rephrased)
		},
		[element, leaf.text]
	)

	const onRephrase = useCallback(
		(text: string) => {
			try {
				const nodes = getNodeEntries(editor).toArray() as Node[][]
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

	const resetActive = () => {
		setActiveLaser(null)
	}

	// const reset = useCallback(() => {
	// 	try {
	// 		const nodes: any = getNodeEntries(editor).toArray()
	// 		const childrenCopy = structuredClone(element.children)

	// 		childrenCopy.forEach((child) => {
	// 			if (child.laser && child.text === leaf.text) {
	// 				delete child.laser
	// 			}
	// 		})

	// 		nodes[0][0].children.forEach((child: any) => {
	// 			if (child.id === element.id) {
	// 				child.children = childrenCopy
	// 			}
	// 		})
	// 		const path = findNodePath(editor, element)

	// 		if (!path) return
	// 		editor.removeNodes({
	// 			at: path,
	// 		})
	// 		editor.insertNodes(
	// 			{
	// 				...element,
	// 				children: childrenCopy,
	// 			},
	// 			{
	// 				at: path,
	// 			}
	// 		)
	// 	} catch (error) {
	// 		console.error(error)
	// 	}
	// }, [editor, element, leaf.text])

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

	return (
		<PlateLeaf
			{...props}
			onClick={() => {
				if (!key) return
				setActiveLaser(key)
			}}
			className={cn(
				'relative border-b-2 border-b-primary/40',
				'bg-primary/40',
				className
			)}
		>
			{children}
			<div
				id={`toolbar-${key}`}
				onClick={(e) => e.stopPropagation()}
				className={`absolute bottom-0 z-[9999] max-w-[75vw] translate-y-full whitespace-nowrap rounded border bg-popover px-1 shadow-md print:hidden ${activeLaser !== key ? 'pointer-events-none opacity-0' : 'opacity-100'}`}
			>
				<RephraseSelection
					elemKey={key || null}
					getSelectedText={getSelectedText}
					onResponse={onResponse}
					reset={resetActive}
					onRephrase={onRephrase}
					previous={[structuredClone(element)]}
					current={rephrasedText ? [structuredClone(rephrasedText)] : null}
				/>
			</div>
		</PlateLeaf>
	)
}
