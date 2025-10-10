import React, { useCallback, useMemo, useState } from 'react'
import { ACTION, EVENT_TYPE, SCREEN_NAME } from '@/constants/analytics'
import {
	ESTIMATED_FLOATING_HEIGHT,
	LASER_LEAF_KEYS,
	RESPONSE_GAP,
} from '@/constants/editor-constants'
import useLaserStore from '@/store/laser-store'
import { CheckedState } from '@radix-ui/react-checkbox'
import { Send } from 'lucide-react'
import { nanoid } from 'nanoid'
import { Descendant } from 'platejs'
import { useEditorRef } from 'platejs/react'

import { Button } from '@/components/aural-ui/button'
import { Checkbox } from '@/components/aural-ui/checkbox'
import Label from '@/components/aural-ui/label'
import Textarea from '@/components/aural-ui/textarea'
import { LaserPlugin } from '@/lib/plate/plugins/laser-plugin'
import { track } from '@/lib/utils/analytics'
import { cn } from '@/lib/utils/helpers'

import { Divider } from '../aural-ui/divider'

export default function FloatingPrompt() {
	const { setActiveLaser, setPromptActive, store: laserStore } = useLaserStore()
	const { promptPosition, promptActive } = laserStore()
	const editor = useEditorRef()

	const [val, setVal] = React.useState<string>('')
	const [additionalContext, setAdditionalContext] = useState(false)

	const key = useMemo(() => {
		if (promptActive) {
			return `laser-id-${promptActive.split('_')[1]}`
		}
		return `laser-id-${nanoid()}`
	}, [promptActive])

	const traverse = useCallback(
		(node: Descendant, intoLaser: boolean) => {
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
					node[LaserPlugin.key as string] = true
					node[key] = true
					node[LASER_LEAF_KEYS.CUSTOM_METHOD] = true
					node[LASER_LEAF_KEYS.PROMPT] = val.trim()
					node[LASER_LEAF_KEYS.ADDITIONAL_CONTEXT] = additionalContext
					setActiveLaser(key)
				}
			} else if ('children' in node) {
				;(node.children as Descendant[]).forEach((child) =>
					traverse(child, intoLaser)
				)
			}
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[promptActive, val, additionalContext, key]
	)

	const onResetLeaf = useCallback(
		(intoLaser = false) => {
			try {
				const val = structuredClone(editor.children)
				val.forEach((node) => traverse(node, intoLaser))
				editor.tf.setValue(val)
				setPromptActive(null)
				track({
					event: EVENT_TYPE.BUTTON_CLICK,
					screenName: SCREEN_NAME.EPISODE_EDITOR,
					metaData: {
						action: ACTION.LASER_START,
						method: 'custom-send',
						flowId: key.split('laser-id-')[1],
					},
				})
			} catch (error) {
				console.error(error)
			}
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[editor, traverse, setPromptActive]
	)

	// eslint-disable-next-line react-hooks/exhaustive-deps
	const name = useMemo(nanoid, [promptActive])

	const positionStyle = useMemo(() => {
		if (!promptPosition) {
			return {}
		}
		const yPosition =
			(promptPosition.clientY ?? 0) +
				(promptPosition.height ?? 0) +
				ESTIMATED_FLOATING_HEIGHT >
			window.innerHeight
				? {
						bottom:
							window.innerHeight - (promptPosition.clientY ?? 0) + RESPONSE_GAP,
					}
				: {
						top:
							(promptPosition.clientY ?? 0) +
							(promptPosition.height ?? 0) +
							RESPONSE_GAP,
					}
		return {
			...yPosition,
			left: promptPosition.clientX || 500,
			width: promptPosition.width || 800,
		}
	}, [promptPosition])

	function handleCheckedChange(checked: CheckedState) {
		if (checked === 'indeterminate') {
			setAdditionalContext(false)
			return
		}
		setAdditionalContext(checked)
	}

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
				'fixed z-9999',
				'rounded-fm-l border-fm-divider-primary bg-fm-surface-primary border p-5 shadow-lg',
				'flex w-full flex-col items-start justify-start gap-5'
			)}
			style={positionStyle}
		>
			<Textarea.Base
				autoFocus
				placeholder="Enter prompt here..."
				name={name}
				autoComplete="off"
				value={val}
				onChange={(e) => setVal(e.target.value)}
				id="prompt-input"
				decoration="filled"
				className="text-fm-primary/80 leading-fm-md w-full min-w-[300px] resize-none [font-size:var(--text-fm-md)] outline-none"
				rows={4}
				minHeight={50}
				maxHeight={150}
			/>
			<Divider wrapperClassName="w-full" />
			<div className="flex w-full justify-between">
				<div className="flex items-center gap-2">
					<Checkbox
						checked={additionalContext}
						onCheckedChange={handleCheckedChange}
						id="additional-context-checkbox"
						className="size-6"
					/>
					<Label htmlFor="additional-context-checkbox">
						Use additional context
					</Label>
				</div>
				<Button
					variant="outline"
					size="sm"
					className="group"
					innerClassName="font-fm-brand border-fm-divider-secondary group-hover:border-fm-divider-contrast group-disabled:translate-y-0 group-disabled:hover:border-fm-divider-secondary"
					onClick={(e) => {
						e.stopPropagation()
						e.preventDefault()
						if (!val.trim()) {
							return
						}
						onResetLeaf(true)
					}}
					leftIcon={<Send size={16} />}
				>
					Send
				</Button>
			</div>
		</div>
	)
}
