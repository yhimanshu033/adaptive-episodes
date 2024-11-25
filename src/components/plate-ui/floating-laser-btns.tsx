import React, { Dispatch, SetStateAction } from 'react'
import { rephraseMethods } from '@/constants/editor-constants'
import useLaserStore, {
	setActiveLaser,
	setPromptActive,
	setScreenY,
} from '@/store/laser-store'
import { useEditorRef } from '@udecode/plate-common/react'
import { ArrowLeft } from 'lucide-react'
import { nanoid } from 'nanoid'

import { LaserPlugin, PromptPlugin } from '@/lib/plate/plugins/laser-plugin'

import { Button } from '../ui/button'

export default function FloatingLaserBtns({
	setShowLaser,
}: {
	setShowLaser: Dispatch<SetStateAction<boolean>>
}) {
	const editor = useEditorRef()
	const { promptActive } = useLaserStore()
	return (
		!promptActive && (
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
							if (method.id === 'custom') {
								console.log(e)
								setScreenY(e.screenY - e.currentTarget.clientHeight)
								const key = `floating-prompt-id-${nanoid()}`
								editor.tf.toggle.mark({ key: PromptPlugin.key })
								editor.tf.toggle.mark({ key })
								setPromptActive(key)
								document.getElementById('prompt-input')?.focus()
								return
							}
							const key = `laser-id-${nanoid()}`
							editor.tf.toggle.mark({ key: `laser-method-${method.id}` })
							editor.tf.toggle.mark({ key: LaserPlugin.key })
							editor.tf.toggle.mark({ key })
							setActiveLaser(key)
						}}
					>
						{method.method}
					</Button>
				))}
			</div>
		)
	)
}
