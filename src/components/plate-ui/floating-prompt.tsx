import React, { useCallback, useMemo } from 'react'
import useLaserStore, {
	setActiveLaser,
	setPromptActive,
} from '@/store/laser-store'
import usePlateStore from '@/store/plate-store'
import { useEditorRef } from '@udecode/plate-common/react'
import { TDescendant } from '@udecode/slate'
import { ArrowLeft, Send } from 'lucide-react'
import { nanoid } from 'nanoid'

import { Button } from '@/components/plate-ui/button'
import { Textarea } from '@/components/ui/textarea'
import { LaserPlugin } from '@/lib/plate/plugins/laser-plugin'
import { cn } from '@/lib/utils'

export default function FloatingPrompt() {
	const { editorY, screenY, promptActive } = useLaserStore()
	const editor = useEditorRef()

	const { isTranslationOpen, sidebar } = usePlateStore()
	const minify = sidebar || isTranslationOpen

	const [val, setVal] = React.useState<string>('')

	const traverse = useCallback(
		(node: TDescendant, intoLaser: boolean) => {
			console.log({ promptActive })
			if (!promptActive) return
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
		[promptActive, val]
	)

	const onResetLeaf = useCallback(
		(intoLaser = false) => {
			try {
				const val = structuredClone(editor.children)
				val.forEach((node) => traverse(node, intoLaser))
				console.log({ val })
				editor.tf.setValue(val)
				setPromptActive(null)
			} catch (error) {
				console.error(error)
			}
		},
		[editor, traverse]
	)

	// eslint-disable-next-line react-hooks/exhaustive-deps
	const name = useMemo(nanoid, [promptActive])

	// if (!laser) return null

	if (!promptActive || !promptActive.startsWith('floating')) return null

	return (
		<div
			onBlur={(e) => {
				if (e.currentTarget.contains(e.relatedTarget)) return
				onResetLeaf()
				// setPromptActive(null)
			}}
			className={cn(
				'absolute z-[9999] flex gap-2 rounded-lg bg-popover',
				minify ? 'w-[35vw]' : 'w-[70vw]'
			)}
			style={{
				top: (screenY || 0) - (editorY || 0),
				left: 48,
			}}
		>
			<Button
				variant="ghost"
				size="sm"
				className="h-24"
				onClick={() => {
					onResetLeaf()
					// setPromptActive(null)
				}}
			>
				<ArrowLeft size={16} />
			</Button>
			<Textarea
				autoFocus
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
					if (!val.trim()) return
					onResetLeaf(true)
					// setTriggerRephrase(activeLaser)
				}}
			>
				<Send size={16} />
			</Button>
		</div>
	)
}
