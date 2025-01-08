import React, { Dispatch, SetStateAction } from 'react'
import { rephraseMethods } from '@/constants/editor-constants'
import useLaserStore from '@/store/laser-store'
import { useEditorRef } from '@udecode/plate-common/react'
import { Value } from '@udecode/slate'
import { ArrowLeft } from 'lucide-react'
import { nanoid } from 'nanoid'
import type { Range } from 'slate'

import { LaserPlugin, PromptPlugin } from '@/lib/plate/plugins/laser-plugin'
import { mergeBlocks } from '@/lib/utils'

import { Button } from '../ui/button'

export default function FloatingLaserBtns({
	setShowLaser,
}: {
	setShowLaser: Dispatch<SetStateAction<boolean>>
}) {
	const editor = useEditorRef()
	const [clicked, setClicked] = React.useState(false)
	const { setActiveLaser, setPromptActive, setScreenY } = useLaserStore()
	const key = `laser-id-${nanoid()}`
	return (
		!clicked && (
			<div className="flex items-center">
				<Button
					variant="ghost"
					size="sm"
					onClick={() => {
						setShowLaser(false)
					}}
				>
					<ArrowLeft size={16} />
				</Button>
				{rephraseMethods.map((method) => (
					<Button
						key={method.id}
						variant="ghost"
						className="my-1"
						onClick={(e) => {
							setClicked(true)
							const children = structuredClone(editor.children)
							let newChildren: Value = children
							if (method.id === 'custom') {
								setScreenY(e.clientY + e.currentTarget.clientHeight)
								const key = `floating-prompt-id-${nanoid()}`
								newChildren = mergeBlocks(children, editor.selection as Range, [
									PromptPlugin.key,
									key,
								])
								document.getElementById('prompt-input')?.focus()
								setPromptActive(key)
							} else {
								newChildren = mergeBlocks(children, editor.selection as Range, [
									`laser-method-${method.id}`,
									LaserPlugin.key,
									key,
								])
								setActiveLaser(key)
							}
							editor.tf.setValue(newChildren)
						}}
					>
						{method.method}
					</Button>
				))}
			</div>
		)
	)
}
