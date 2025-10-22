import React, { useCallback, useMemo, useState } from 'react'
import { ACTION, EVENT_TYPE, SCREEN_NAME } from '@/constants/analytics'
import {
	LASER_LEAF_KEYS,
	LASER_PROMPT_KEYS,
} from '@/constants/editor-constants'
import useSuggestionGuard from '@/hooks/plate/use-suggestion-guard'
import useLaserStore from '@/store/laser-store'
import { CheckedState } from '@radix-ui/react-checkbox'
import { Send } from 'lucide-react'
import { nanoid } from 'nanoid'
import { useEditorRef } from 'platejs/react'

import { Button } from '@/components/aural-ui/button'
import { Checkbox } from '@/components/aural-ui/checkbox'
import Label from '@/components/aural-ui/label'
import Textarea from '@/components/aural-ui/textarea'
import { track } from '@/lib/utils/analytics'
import { cn } from '@/lib/utils/helpers'

import { Divider } from '../aural-ui/divider'

export default function FloatingPrompt() {
	const { setActiveLaser, setPromptActive, store: laserStore } = useLaserStore()
	const { promptActive } = laserStore()
	const editor = useEditorRef()

	const [val, setVal] = React.useState<string>('')
	const [additionalContext, setAdditionalContext] = useState(false)
	const { suggestionGuard } = useSuggestionGuard()

	const key = useMemo(() => {
		if (promptActive) {
			return `${LASER_LEAF_KEYS.ID_START}${promptActive.split(LASER_PROMPT_KEYS.ID_START)[1]}`
		}
		return `${LASER_LEAF_KEYS.ID_START}${nanoid()}`
	}, [promptActive])

	const onResetLeaf = useCallback(
		(intoLaser = false) => {
			if (!promptActive) {
				return
			}
			try {
				const matches = editor.api
					.nodes({
						at: [],
						match: (n) => !!n[promptActive],
					})
					.toArray()
				const firstMatch = matches?.[0]
				if (!firstMatch || !matches) {
					return
				}
				const aggregateObj = matches.reduce((acc, curr) => {
					return Object.assign(acc, curr[0])
				}, {})
				const laserPromptKeys = Object.keys(aggregateObj).filter((k) =>
					k.startsWith(LASER_PROMPT_KEYS.KEY)
				)

				suggestionGuard(() => {
					if (intoLaser) {
						editor.tf.setNodes(
							{
								[LASER_LEAF_KEYS.KEY]: true,
								[key]: true,
								[LASER_LEAF_KEYS.CUSTOM_METHOD]: true,
								[LASER_LEAF_KEYS.PROMPT]: val.trim(),
								[LASER_LEAF_KEYS.ADDITIONAL_CONTEXT]: additionalContext,
							},
							{
								at: firstMatch[1],
							}
						)
						setTimeout(() => {
							setActiveLaser(key)
						}, 500)
					}
					editor.tf.unsetNodes(laserPromptKeys, {
						at: [],
						match: (n) => !!n[promptActive],
					})
				})

				setPromptActive(null)
				track({
					event: EVENT_TYPE.BUTTON_CLICK,
					screenName: SCREEN_NAME.EPISODE_EDITOR,
					metaData: {
						action: ACTION.LASER_START,
						method: 'custom-send',
						flowId: key.split(LASER_LEAF_KEYS.ID_START)[1],
					},
				})
			} catch (error) {
				console.error(error)
			}
		},

		[
			editor.api,
			promptActive,
			editor.tf,
			setPromptActive,
			key,
			suggestionGuard,
			additionalContext,
			val,
			setActiveLaser,
		]
	)

	// eslint-disable-next-line react-hooks/exhaustive-deps
	const name = useMemo(nanoid, [promptActive])

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
				if (
					e.currentTarget.contains(e.relatedTarget) ||
					e.relatedTarget?.id === LASER_PROMPT_KEYS.POPOVER
				) {
					return
				}
				onResetLeaf()
				setPromptActive(null)
			}}
			className={cn(
				'rounded-fm-l bg-fm-surface-primary p-5',
				'flex w-full flex-col items-start justify-start gap-5'
			)}
		>
			<Textarea.Base
				autoFocus
				placeholder="Enter prompt here..."
				name={name}
				autoComplete="off"
				value={val}
				onChange={(e) => setVal(e.target.value)}
				id={LASER_PROMPT_KEYS.INPUT}
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
						id={LASER_PROMPT_KEYS.CONTEXT_CHECKBOX}
						className="size-6"
					/>
					<Label htmlFor={LASER_PROMPT_KEYS.CONTEXT_CHECKBOX}>
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
