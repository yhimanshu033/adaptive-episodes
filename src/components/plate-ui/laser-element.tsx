/* eslint-disable  @typescript-eslint/no-unsafe-assignment */
/* eslint-disable  @typescript-eslint/no-unsafe-call */
/* eslint-disable  @typescript-eslint/no-unsafe-member-access */
/* eslint-disable  @typescript-eslint/no-explicit-any */
/* eslint-disable  @typescript-eslint/no-unsafe-return */
/* eslint-disable  @typescript-eslint/no-unused-vars */
import React, { useCallback, useEffect, useRef } from 'react'
import useLaserStore, {
	getLaser,
	setActiveLaser,
	setLaser,
} from '@/store/laser-store'
import { cn, withRef } from '@udecode/cn'
import { getNodeEntries, TElement, TText } from '@udecode/plate-common'
import {
	PlateLeaf,
	useEditorRef,
	useElement,
} from '@udecode/plate-common/react'
import { findNodePath } from '@udecode/slate-react'

import { LaserPlugin } from '@/lib/plate/plugins/laser-plugin'

import RephraseSelection from './rephrase-selection'

function getLaserKey(elem: TText) {
	return Object.keys(elem).find((key) => key.startsWith('laser-'))
}

export const LaserElement = withRef<typeof PlateLeaf>(
	({ children, className, ...props }, ref) => {
		const editor = useEditorRef()
		const element = useElement(LaserPlugin.key)
		const [rephrasedText, setRephrasedText] = React.useState<TElement | null>(
			null
		)
		const key = getLaserKey(props.leaf)

		const getSelectedText = useCallback(() => {
			const text = props.leaf.text
			let prevtext = ''
			let nexttext = ''

			// Split into two lists based on `laserOccured`
			const texts = children.props.parent.children.map(
				(child: any) => child.text
			)
			const laserIndex = texts.indexOf(text)

			if (laserIndex !== -1) {
				prevtext = texts.slice(0, laserIndex).join('')
				nexttext = texts.slice(laserIndex + 1).join('')
			}

			return { text, prevtext, nexttext }
		}, [children, props.leaf.text])

		const onResponse = useCallback(
			(text: string) => {
				const childrenCopy = structuredClone(element.children)

				childrenCopy.forEach((child) => {
					if (child.laser && child.text === props.leaf.text) {
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
			[element, props.leaf.text]
		)

		const onRephrase = useCallback(
			(text: string) => {
				try {
					const nodes: any = getNodeEntries(editor).toArray()
					const childrenCopy = structuredClone(element.children)

					childrenCopy.forEach((child) => {
						if (child.laser && child.text === props.leaf.text) {
							child.text = text
							delete child.laser
						}
					})

					nodes[0][0].children.forEach((child: any) => {
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
			[editor, element, props.leaf.text]
		)

		const resetActive = () => {
			setActiveLaser(null)
		}

		const reset = useCallback(() => {
			try {
				const nodes: any = getNodeEntries(editor).toArray()
				const childrenCopy = structuredClone(element.children)

				childrenCopy.forEach((child) => {
					if (child.laser && child.text === props.leaf.text) {
						delete child.laser
					}
				})

				nodes[0][0].children.forEach((child: any) => {
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
		}, [editor, element, props.leaf.text])

		const { active: activeLaser } = useLaserStore()

		const divRef = useRef<HTMLDivElement>(null)

		useEffect(() => {
			if (!key) return
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

		return (
			<PlateLeaf
				ref={ref}
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
					ref={divRef}
					id={`toolbar-${key}`}
					onClick={(e) => e.stopPropagation()}
					className={`absolute bottom-0 z-[9999] translate-y-full whitespace-nowrap rounded border bg-popover px-1 shadow-md print:hidden ${activeLaser !== key ? 'pointer-events-none opacity-0' : 'opacity-100'}`}
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
)
