import React, { useCallback, useMemo } from 'react'
import useLaserStore, {
	setActiveLaser,
	setLaser,
	setResponseActive,
	setTriggerRephrase,
} from '@/store/laser-store'
import usePlateStore from '@/store/plate-store'
import { ScrollArea } from '@radix-ui/react-scroll-area'
import { useEditorRef } from '@udecode/plate-common/react'
import { TDescendant } from '@udecode/slate'
import { ArrowLeft, RotateCw } from 'lucide-react'
import { nanoid } from 'nanoid'

import { Button } from '@/components/plate-ui/button'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

export default function FloatingLaserResponse() {
	const {
		editorY,
		responseActive,
		active: activeLaser,
		lasers: allLasers,
	} = useLaserStore()
	const editor = useEditorRef()

	const { isTranslationOpen, sidebar } = usePlateStore()
	const minify = sidebar || isTranslationOpen

	const laser =
		responseActive === activeLaser && responseActive
			? allLasers[responseActive]
			: null

	const setVal = useCallback(
		(val: string) => {
			if (!activeLaser || !laser) return
			setLaser({ id: activeLaser, laser: { ...laser, response: val } })
		},
		[activeLaser, laser]
	)

	const val = laser?.response || ''
	// eslint-disable-next-line react-hooks/exhaustive-deps
	const name = useMemo(nanoid, [responseActive])

	const key = responseActive

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
				'absolute z-[9999] flex gap-2 rounded-lg bg-popover',
				minify ? 'w-[35vw]' : 'w-[70vw]'
			)}
			style={{
				top: (laser.clientY || 0) - (editorY || 0) - 50,
				left: 48,
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
				<ScrollArea className="mb-1 rounded border p-2 pr-3">
					<p className="mb-2 max-h-16 text-wrap text-muted-foreground">
						{laser.text}
					</p>
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
