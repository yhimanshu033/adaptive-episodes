import React, { useCallback, useMemo } from 'react'
import useLaserStore from '@/store/laser-store'
import usePlateStore from '@/store/plate-store'
import { TDescendant } from '@udecode/plate-common'
import { useEditorRef } from '@udecode/plate-common/react'
import { ArrowLeft, Send } from 'lucide-react'
import { nanoid } from 'nanoid'

import { Button } from '@/components/plate-ui/button'
import { Textarea } from '@/components/ui/textarea'
import { LaserPlugin } from '@/lib/plate/plugins/laser-plugin'
import { cn } from '@/lib/utils/helpers'

export default function FloatingPrompt() {
	const { setActiveLaser, setPromptActive, store: laserStore } = useLaserStore()
	const { screenY, promptActive } = laserStore()
	const editor = useEditorRef()

	const { store } = usePlateStore()
	const { sidebar } = store()
	const minify = !!sidebar

	const [val, setVal] = React.useState<string>('')

	const traverse = useCallback(
		(node: TDescendant, intoLaser: boolean) => {
			if (!promptActive) {
				return
			}
			if (promptActive in node) {
				const keys = Object.keys(node).filter((key) =>
					key.startsWith('floating-prompt')
				)
				keys.forEach((key) => {
					delete node[key]
				})
				if (intoLaser) {
					const key = `laser-id-${nanoid()}`
					node[LaserPlugin.key] = true
					node[key] = true
					node['laser-method-custom'] = true
					node['laser-inserted-prompt'] = val.trim()
					setActiveLaser(key)
				}
			} else if ('children' in node) {
				;(node.children as TDescendant[]).forEach((child) =>
					traverse(child, intoLaser)
				)
			}
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[promptActive, val]
	)

	const onResetLeaf = useCallback(
		(intoLaser = false) => {
			try {
				const val = structuredClone(editor.children)
				val.forEach((node) => traverse(node, intoLaser))
				editor.tf.setValue(val)
				setPromptActive(null)
			} catch (error) {
				console.error(error)
			}
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[editor, traverse, setPromptActive]
	)

	// eslint-disable-next-line react-hooks/exhaustive-deps
	const name = useMemo(nanoid, [promptActive])

	if (!promptActive || !promptActive.startsWith('floating')) {
		return null
	}

	return (
		<div
			onBlur={(e) => {
				if (e.currentTarget.contains(e.relatedTarget)) {
					return
				}
				onResetLeaf()
			}}
			className={cn(
				'bg-popover fixed z-9999 flex gap-2 rounded-lg',
				minify ? 'w-[35vw]' : 'w-[70vw]'
			)}
			style={{
				top: Math.max(Math.min(screenY || 0, 650) + 16, 180),
				left: 64,
			}}
		>
			<Button
				variant="ghost"
				size="sm"
				className="h-24"
				onClick={() => {
					onResetLeaf()
				}}
			>
				<ArrowLeft size={16} />
			</Button>
			<Textarea
				autoFocus
				placeholder="Enter prompt here..."
				name={name}
				autoComplete="off"
				value={val}
				onChange={(e) => setVal(e.target.value)}
				id="prompt-input"
			/>
			<Button
				variant="default"
				size="sm"
				className="h-24"
				onClick={(e) => {
					e.stopPropagation()
					e.preventDefault()
					if (!val.trim()) {
						return
					}
					onResetLeaf(true)
				}}
			>
				<Send size={16} />
			</Button>
		</div>
	)
}
