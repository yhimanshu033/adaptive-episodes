/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import React, { useCallback, useEffect, useRef } from 'react'
import useEditorData from '@/hooks/plate/use-editor-data'
import useLaserStore from '@/store/laser-store'
import { cn } from '@udecode/cn'
import { Descendant, Text } from 'platejs'
import { PlateLeaf, PlateLeafProps, useEditorRef } from 'platejs/react'

import LaserRephrase from '@/components/plate-ui/laser-rephrase'
import {
	breakDownValue,
	getCommentNode,
	getParentWidth,
} from '@/lib/utils/plate'

function getLaserKey(elem: Text) {
	return Object.keys(elem).find((key) => key.startsWith('laser-id-'))
}

function getMethodId(elem: Text) {
	const method = Object.keys(elem).find((key) =>
		key.startsWith('laser-method-')
	)
	return method?.split('-').pop()
}

export const LaserLeaf = ({ className, ...props }: PlateLeafProps) => {
	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
	const { children, leaf } = props
	const editor = useEditorRef()
	const [responseMode, setResponseMode] = React.useState(false)
	const key = getLaserKey(leaf)
	const methodId = getMethodId(leaf)
	const divRef = useRef<HTMLDivElement>(null)
	const areaRef = useRef<HTMLDivElement>(null)
	const btnRef = useRef<HTMLButtonElement>(null)
	const {
		getLaser,
		setActiveLaser,
		setLaser,
		setResponseActive,
		store: laserStore,
	} = useLaserStore()
	const { children: allChildren } = useEditorData()

	useEffect(() => {
		if (!key || !divRef?.current) {
			return
		}
		let laser = getLaser(key)
		laser ??= { response: '', text: '' }
		const rect = divRef.current?.getBoundingClientRect()
		if (!rect) {
			return
		}

		const { blockAncestorContentWidth, blockAncestorClientX } =
			getParentWidth(areaRef)

		setLaser({
			laser: {
				...laser,
				clientY: rect.y,
				height: rect.height,
				clientX: blockAncestorClientX,
				width: blockAncestorContentWidth,
			},
			id: key,
		})
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [divRef, key])

	const { active: activeLaser } = laserStore()
	const getSelectedText = useCallback(() => {
		if (!key) {
			return { text: leaf.text, prevtext: '', nexttext: '' }
		}
		const { text } = leaf
		let prevtext = ''
		let nexttext = ''

		const leafPath = editor.api.node({
			at: [],
			match: (n) => JSON.stringify(n) === JSON.stringify(leaf),
		})?.[1]
		const parent = leafPath ? editor.api.parent(leafPath)?.[0] : null
		const descendants: Descendant[] = parent?.children || []

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
			if (!prevtext || !nexttext) {
				const { afterText, beforeText } = getCommentNode(allChildren, key)
				prevtext = prevtext.length
					? prevtext
					: beforeText.split(/\n+/).length > 2
						? beforeText.split(/\n+/).slice(-3).join('\n')
						: beforeText
				nexttext = nexttext.length
					? nexttext
					: afterText.split(/\n+/).length > 2
						? afterText.split(/\n+/).slice(0, 3).join('\n')
						: afterText
			}
		}

		return { text, prevtext, nexttext }
	}, [key, leaf, editor.api, allChildren])

	const traverse = useCallback(
		(node: Descendant) => {
			if (!key) {
				return
			}
			if (key in node) {
				const keys = Object.keys(node).filter((key) => key.startsWith('laser'))
				keys.forEach((key) => {
					delete node[key]
				})
			} else if ('children' in node) {
				;(node.children as Descendant[]).forEach(traverse)
			}
		},
		[key]
	)

	const onResetLeaf = useCallback(() => {
		try {
			const val = structuredClone(editor.children)
			val.forEach(traverse)
			editor.tf.setValue(breakDownValue(val))
		} catch (error) {
			console.error(error)
		}
	}, [editor, traverse])

	const resetActive = useCallback(() => {
		setActiveLaser(null)
	}, [setActiveLaser])

	function updateLaser() {
		if (!key) {
			return
		}
		let laser = getLaser(key)
		const rect = areaRef.current?.getBoundingClientRect()

		const { blockAncestorContentWidth, blockAncestorClientX } =
			getParentWidth(areaRef)

		laser = laser
			? {
					...laser,
					clientY: rect ? rect.top : 0,
					height: rect ? rect.height : 0,
					clientX: blockAncestorClientX,
					width: blockAncestorContentWidth,
				}
			: {
					response: '',
					text: '',
					clientY: rect ? rect.top : 0,
					height: rect ? rect.height : 0,
					clientX: blockAncestorClientX,
					width: blockAncestorContentWidth,
				}

		setLaser({
			laser: {
				...laser,
			},
			id: key,
		})
	}
	useEffect(() => {
		updateLaser()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [key])

	const handleBlur = useCallback(
		(e: React.FocusEvent) => {
			if (activeLaser !== key) {
				return
			}
			const responseDiv = document.getElementById(`leaf-response-${key}`)
			const responseInput = document.getElementById(
				`leaf-response-editor-${key}`
			)
			if (
				document.activeElement === responseInput ||
				responseDiv?.contains(e.relatedTarget)
			) {
				return
			}
			if (!areaRef.current?.contains(e.relatedTarget)) {
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

	const handleClick = useCallback(() => {
		if (!key) {
			return
		}
		setActiveLaser(key)
		if (responseMode) {
			setResponseActive(key)
		}
		btnRef.current?.focus()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [key, responseMode])

	return (
		<PlateLeaf
			ref={areaRef}
			{...props}
			attributes={{
				onClick: handleClick,
			}}
			className={cn(
				'relative border-b-2 border-b-blue-500/70',
				'bg-blue-500/40',
				className
			)}
		>
			{children}
			<button
				ref={btnRef}
				onFocus={() => {
					if (!key) {
						return
					}
					updateLaser()
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
					'absolute -bottom-1 z-9999 translate-y-full whitespace-nowrap print:hidden',
					{
						'pointer-events-none opacity-0': activeLaser !== key,
						'opacity-100': activeLaser === key,
					}
				)}
				style={{
					width: getParentWidth(divRef).blockAncestorContentWidth || 800,
				}}
			>
				<LaserRephrase
					setResponseMode={setResponseMode}
					promptInput={(leaf['laser-inserted-prompt'] as string) || ''}
					onResetLeaf={onResetLeaf}
					methodId={methodId || ''}
					elemKey={key || null}
					getSelectedText={getSelectedText}
				/>
			</div>
		</PlateLeaf>
	)
}
