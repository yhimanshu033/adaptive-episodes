'use client'

import React, { useMemo, useState } from 'react'
import ChevronLeftIcon from '@/icons/chevron-left-icon'
import ChevronRightIcon from '@/icons/chevron-right-icon'
import OutlinerStreamedResponse from '@/page-builders/plate-editor/sidebar-sections/outliner/outliner-streamed-response'

import { IconButton } from '@/components/aural-ui/icon-button'
import { Else, If, IfElse } from '@/components/aural-ui/if-else'
import TextArea, { TextAreaProps } from '@/components/aural-ui/textarea'
import { getSafeArrayIdx } from '@/lib/utils/helpers'

interface MultiTextAreaProps {
	active?: number
	setActive?: (idx: number) => void
	textarea: {
		isGenerating?: boolean
		props: TextAreaProps
		title?: string
	}[]
}
export default function MultiTextArea({
	textarea,
	active: propActive,
	setActive: setPropActive,
}: MultiTextAreaProps) {
	const [fallbackActive, setFallbackActive] = useState(0)

	const active = useMemo(() => {
		return propActive ?? fallbackActive
	}, [propActive, fallbackActive])

	const setActive = useMemo(() => {
		return setPropActive ?? setFallbackActive
	}, [setPropActive, setFallbackActive])

	return (
		<div>
			<div className="flex items-center justify-between">
				<p>{textarea[active]?.title}</p>
				<div className="flex items-center gap-2">
					<p>{`${active + 1}/${textarea.length}`}</p>
					<IconButton
						label="previous text"
						variant="ghost"
						icon={<ChevronLeftIcon />}
						onClick={() =>
							setActive(getSafeArrayIdx(active - 1, textarea.length))
						}
						size="small"
					/>
					<IconButton
						label="next text"
						variant="ghost"
						icon={<ChevronRightIcon />}
						onClick={() =>
							setActive(getSafeArrayIdx(active + 1, textarea.length))
						}
						size="small"
					/>
				</div>
			</div>
			<IfElse condition={!!textarea[active]?.isGenerating}>
				<If>
					<OutlinerStreamedResponse
						response={textarea[active]?.props?.value || ''}
					/>
				</If>
				<Else>
					<TextArea {...textarea[active]?.props} />
				</Else>
			</IfElse>
		</div>
	)
}
