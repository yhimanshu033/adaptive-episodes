import React, { useCallback, useMemo } from 'react'
import {
	ESTIMATED_FLOATING_HEIGHT,
	RESPONSE_GAP,
} from '@/constants/editor-constants'
import { CrossIcon } from '@/icons/cross-icon'
import { TickIcon } from '@/icons/tick-icon'
import useLaserStore from '@/store/laser-store'
import { RotateCw } from 'lucide-react'
import { nanoid } from 'nanoid'
import { useEditorRef } from 'platejs/react'

import { Button } from '@/components/aural-ui/button'
import Textarea from '@/components/aural-ui/textarea'
import { cn } from '@/lib/utils/helpers'
import {
	breakDownValue,
	deleteNodesWithStartKeys,
	keyNodeOperationOnce,
	updateNodesWithStartKeys,
} from '@/lib/utils/plate'

import { Divider } from '../aural-ui/divider'

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

	const laser =
		responseActive === activeLaser && responseActive
			? allLasers[responseActive]
			: null

	const setVal = useCallback(
		(val: string) => {
			if (!activeLaser || !laser) {
				return
			}
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
			if (!key) {
				return
			}
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
		if (!key) {
			return
		}
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

	const positionStyle = useMemo(() => {
		if (!laser) {
			return {}
		}
		const yPosition =
			(laser.clientY ?? 0) + (laser.height ?? 0) + ESTIMATED_FLOATING_HEIGHT >
			window.innerHeight
				? { bottom: window.innerHeight - (laser.clientY ?? 0) + RESPONSE_GAP }
				: { top: (laser.clientY ?? 0) + (laser.height ?? 0) + RESPONSE_GAP }
		return {
			...yPosition,
			left: laser.clientX || 500,
			width: laser.width || 800,
		}
	}, [laser])

	if (!laser) {
		return null
	}

	return (
		<div
			onBlur={(e) => {
				if (e.currentTarget.contains(e.relatedTarget)) {
					return
				}
				setActiveLaser(null)
			}}
			className={cn(
				'fixed z-9999 flex gap-2',
				'rounded-fm-l border-fm-divider-primary bg-fm-surface-primary border p-5 shadow-lg'
			)}
			style={positionStyle}
		>
			<div
				id={`leaf-response-${key}`}
				onClick={(e) => {
					e.stopPropagation()
					e.preventDefault()
				}}
				className={cn('flex w-full flex-col items-start justify-start gap-5')}
			>
				<Textarea.Base
					name={name}
					id={`leaf-response-editor-${key}`}
					className="text-fm-primary/80 leading-fm-md w-full min-w-[300px] resize-none [font-size:var(--text-fm-md)] outline-none"
					placeholder="Rephrase your text here..."
					value={val}
					onChange={(e) => setVal(e.target.value)}
					maxHeight={150}
					unstyled
				/>
				<Divider wrapperClassName="w-full" />
				<div className="flex w-full items-center justify-between">
					<Button
						title="Rephrase"
						variant="outline"
						size="sm"
						onClick={() => {
							handleRephrase()
						}}
						className="group"
						innerClassName="font-fm-brand border-fm-divider-secondary group-hover:border-fm-divider-contrast group-disabled:translate-y-0 group-disabled:hover:border-fm-divider-secondary"
					>
						<RotateCw size={16} />
						Try again
					</Button>
					<div className="flex items-center justify-end gap-2">
						<Button
							variant="outline"
							size="sm"
							onClick={handleAcceptRephrase}
							leftIcon={<TickIcon className="size-4" />}
							className="group"
							innerClassName="font-fm-brand border-fm-divider-secondary group-hover:border-fm-divider-contrast group-disabled:translate-y-0 group-disabled:hover:border-fm-divider-secondary"
						>
							Apply
						</Button>
						<Button
							variant="outline"
							size="sm"
							onClick={handleRejectRephrase}
							className="group"
							innerClassName="font-fm-brand border-fm-divider-secondary group-hover:border-fm-divider-contrast group-disabled:translate-y-0 group-disabled:hover:border-fm-divider-secondary"
						>
							<CrossIcon className="size-4" />
						</Button>
					</div>
				</div>
			</div>
		</div>
	)
}
