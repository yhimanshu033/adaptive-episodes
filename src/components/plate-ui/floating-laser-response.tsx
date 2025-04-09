import React, { useCallback, useMemo } from 'react'
import useLaserStore from '@/store/laser-store'
import usePlateStore from '@/store/plate-store'
import { ScrollArea } from '@radix-ui/react-scroll-area'
import { useEditorRef } from '@udecode/plate-common/react'
import { ArrowLeft, RotateCw } from 'lucide-react'
import { nanoid } from 'nanoid'

import { Button } from '@/components/plate-ui/button'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils/helpers'
import {
	breakDownValue,
	deleteNodesWithStartKeys,
	keyNodeOperationOnce,
	updateNodesWithStartKeys,
} from '@/lib/utils/plate'

export default function FloatingLaserResponse() {
	const {
		setActiveLaser,
		setResponseActive,
		setTriggerRephrase,
		setLaser,
		store: laserStore,
	} = useLaserStore()
	const {
		responseActive,
		active: activeLaser,
		lasers: allLasers,
	} = laserStore()
	const editor = useEditorRef()

	const { store } = usePlateStore()
	const { sidebar } = store()
	const minify = !!sidebar

	const laser =
		responseActive === activeLaser && responseActive
			? allLasers[responseActive]
			: null

	const setVal = useCallback(
		(val: string) => {
			if (!activeLaser || !laser) return
			setLaser({ id: activeLaser, laser: { ...laser, response: val } })
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[activeLaser, laser]
	)

	const val = laser?.response || ''
	// eslint-disable-next-line react-hooks/exhaustive-deps
	const name = useMemo(nanoid, [responseActive])

	const key = responseActive

	const onRephrase = useCallback(
		(text: string) => {
			if (!key) return
			try {
				const val = structuredClone(editor.children)

				const newVal = keyNodeOperationOnce(
					val,
					key,
					(node) => updateNodesWithStartKeys('laser', text, node),
					(node) => updateNodesWithStartKeys('laser', '', node)
				)

				editor.tf.setValue(breakDownValue(newVal))
			} catch (error) {
				console.error(error)
			}
		},
		[editor, key]
	)

	const onResetLeaf = useCallback(() => {
		if (!key) return
		try {
			const val = structuredClone(editor.children)
			const newVal = keyNodeOperationOnce(
				val,
				key,
				(node) => deleteNodesWithStartKeys('laser', node),
				(node) => deleteNodesWithStartKeys('laser', node)
			)
			editor.tf.setValue(breakDownValue(newVal))
		} catch (error) {
			console.error(error)
		}
	}, [editor, key])

	function handleAcceptRephrase() {
		onRephrase(val)
		onResetLeaf()
		setActiveLaser(null)
	}

	function handleRejectRephrase() {
		onResetLeaf()
		setActiveLaser(null)
	}

	function handleRephrase() {
		setTriggerRephrase(key)
		setResponseActive(null)
	}

	if (!laser) return null

	return (
		<div
			onBlur={(e) => {
				if (e.currentTarget.contains(e.relatedTarget)) return
				setActiveLaser(null)
			}}
			className={cn(
				'fixed z-[9999] flex gap-2 rounded-lg bg-popover p-2',
				minify ? 'w-[35vw]' : 'w-[70vw]'
			)}
			style={{
				top: Math.max(Math.min(laser.clientY || 0, 580) + 24, 180),
				left: 64,
			}}
		>
			<Button
				variant="ghost"
				size="sm"
				className="h-48"
				onClick={() => {
					setActiveLaser(null)
				}}
			>
				<ArrowLeft size={16} />
			</Button>
			<div
				id={`leaf-response-${key}`}
				onClick={(e) => {
					e.stopPropagation()
					e.preventDefault()
				}}
				className={cn('w-full')}
			>
				<ScrollArea className="mb-1 overflow-y-auto rounded border p-2 pr-3">
					<div
						dangerouslySetInnerHTML={{
							__html: laser.text.replace(/\n/g, '<br/>'),
						}}
						className="mb-2 max-h-16 text-wrap text-muted-foreground"
					/>
				</ScrollArea>
				<Textarea
					name={name}
					id={`leaf-response-editor-${key}`}
					className="mb-4 min-w-[300px] text-accent-foreground"
					value={val}
					onChange={(e) => setVal(e.target.value)}
				/>
				<div className="flex items-center justify-between">
					<Button
						variant="ghost"
						onClick={() => {
							handleRephrase()
						}}
					>
						<RotateCw size={16} />
					</Button>
					<div className="flex items-center justify-end gap-2">
						<Button
							variant="outline"
							size="sm"
							className="mr-2"
							onClick={handleRejectRephrase}
						>
							Reject
						</Button>
						<Button size="sm" onClick={handleAcceptRephrase}>
							Accept
						</Button>
					</div>
				</div>
			</div>
		</div>
	)
}
