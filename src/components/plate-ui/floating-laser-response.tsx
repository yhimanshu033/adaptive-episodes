import React, { useCallback, useMemo } from 'react'
import { ACTION, EVENT_TYPE, SCREEN_NAME } from '@/constants/analytics'
import { LASER_LEAF_KEYS } from '@/constants/editor-constants'
import useSuggestionGuard from '@/hooks/plate/use-suggestion-guard'
import { CrossIcon } from '@/icons/cross-icon'
import { TickIcon } from '@/icons/tick-icon'
import useLaserStore from '@/store/laser-store'
import { RotateCw } from 'lucide-react'
import { nanoid } from 'nanoid'
import { useEditorRef } from 'platejs/react'

import { Button } from '@/components/aural-ui/button'
import Textarea from '@/components/aural-ui/textarea'
import Image from '@/components/ui/image'
import { track } from '@/lib/utils/analytics'
import { cn } from '@/lib/utils/helpers'

import { Divider } from '../aural-ui/divider'

export default function FloatingLaserResponse({
	onTryAgain,
	onResetLeaf,
}: {
	onResetLeaf: () => void
	onTryAgain: () => void
}) {
	const { setActiveLaser, setLaser, store: laserStore } = useLaserStore()
	const { active: key, lasers: allLasers } = laserStore()
	const editor = useEditorRef()
	const { suggestionGuard } = useSuggestionGuard()

	const laser = useMemo(() => (key ? allLasers[key] : null), [key, allLasers])

	const setVal = useCallback(
		(val: string) => {
			if (!key || !laser) {
				return
			}
			setLaser({ id: key, laser: { ...laser, response: val } })
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[key, laser]
	)

	const val = useMemo(() => laser?.response || '', [laser])
	// eslint-disable-next-line react-hooks/exhaustive-deps
	const name = useMemo(nanoid, [key])

	const onRephrase = useCallback(
		(text: string) => {
			if (!key) {
				return
			}
			try {
				const firstMatch = editor.api.node({
					at: [],
					match: (n) => !!n?.[key],
				})
				if (!firstMatch) {
					return
				}
				suggestionGuard(() => {
					editor.tf.insertText(text, {
						at: firstMatch[1],
					})
					editor.tf.insertBreak()
				})
			} catch (error) {
				console.error(error)
			}
		},
		[editor, key, suggestionGuard]
	)

	function handleAcceptRephrase() {
		onRephrase(val)
		onResetLeaf()
		setActiveLaser(null)
		track({
			event: EVENT_TYPE.BUTTON_CLICK,
			screenName: SCREEN_NAME.EPISODE_EDITOR,
			metaData: {
				action: ACTION.LASER_RESPONSE_ACCEPT,
				flowId: key?.split?.(LASER_LEAF_KEYS.ID_START)?.[1],
			},
		})
	}

	function handleRejectRephrase() {
		onResetLeaf()
		setActiveLaser(null)
		track({
			event: EVENT_TYPE.BUTTON_CLICK,
			screenName: SCREEN_NAME.EPISODE_EDITOR,
			metaData: {
				action: ACTION.LASER_RESPONSE_REJECT,
				flowId: key?.split?.(LASER_LEAF_KEYS.ID_START)?.[1],
			},
		})
	}

	function handleRephrase() {
		onTryAgain()
		track({
			event: EVENT_TYPE.BUTTON_CLICK,
			screenName: SCREEN_NAME.EPISODE_EDITOR,
			metaData: {
				action: ACTION.LASER_RESPONSE_RETRY,
				flowId: key?.split?.(LASER_LEAF_KEYS.ID_START)?.[1],
			},
		})
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
				'flex gap-2',
				'rounded-fm-l border-fm-divider-primary bg-fm-surface-primary border p-5 shadow-lg'
			)}
		>
			<Image
				alt="laser gradient"
				className="pointer-events-none absolute top-0 right-0 z-0 h-full"
				src="/assets/laser-bg-gradient.png"
			/>
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
